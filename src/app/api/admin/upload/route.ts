import { NextRequest, NextResponse } from 'next/server';
import { getRequestAdminSession } from '@/lib/auth';
import { updateProfile } from '@/lib/portfolio';
import { isSupabaseConfigured, getSupabaseClient } from '@/lib/supabase';

// Supported mime types for media and photos
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
  'image/avif',
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

/**
 * POST /api/admin/upload
 * Handles direct file upload for user photo, thumbnails, and media assets
 */
export async function POST(request: NextRequest) {
  const session = getRequestAdminSession(request);
  if (!session || !session.authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const isProfile = formData.get('isProfile') === 'true' || formData.get('type') === 'profile';

    if (!file) {
      return NextResponse.json({ error: 'No file provided in form data.' }, { status: 400 });
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          error: `Invalid file format "${file.type}". Allowed formats: JPEG, PNG, WebP, GIF, SVG, AVIF.`,
        },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File size exceeds maximum allowed limit (10MB).' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    let finalUrl = '';

    // Attempt Supabase storage upload if configured
    if (isSupabaseConfigured()) {
      const supabase = getSupabaseClient();
      if (supabase) {
        try {
          const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
          const filename = `avatar-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${extension}`;
          const bucketName = 'portfolio-media';

          const { data: uploadData, error: uploadError } = await supabase.storage
            .from(bucketName)
            .upload(filename, buffer, {
              contentType: file.type,
              upsert: true,
            });

          if (!uploadError && uploadData) {
            const { data: publicUrlData } = supabase.storage
              .from(bucketName)
              .getPublicUrl(filename);
            if (publicUrlData && publicUrlData.publicUrl) {
              finalUrl = publicUrlData.publicUrl;
            }
          }
        } catch (storageErr) {
          console.warn('Supabase storage upload fallback to base64 data URI:', storageErr);
        }
      }
    }

    // Fallback: If storage is not available or failed, encode directly as high-fidelity Base64 Data URL
    if (!finalUrl) {
      const base64 = buffer.toString('base64');
      finalUrl = `data:${file.type};base64,${base64}`;
    }

    // If requested as user profile photo, save directly to profile state
    if (isProfile) {
      await updateProfile({ profileImage: finalUrl });
    }

    return NextResponse.json({
      success: true,
      url: finalUrl,
      filename: file.name,
      size: file.size,
      type: file.type,
      message: isProfile ? 'Profile photo uploaded and saved.' : 'File uploaded successfully.',
    });
  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json(
      { error: 'Failed to process and upload file.' },
      { status: 500 }
    );
  }
}
