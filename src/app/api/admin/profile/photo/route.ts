import { NextRequest, NextResponse } from 'next/server';
import { getRequestAdminSession } from '@/lib/auth';
import { updateProfile, getPortfolioData } from '@/lib/portfolio';
import { isGoogleDriveUrl, getDriveThumbnailUrl } from '@/lib/media';

/**
 * GET /api/admin/profile/photo
 * Retrieves the current profile photo URL
 */
export async function GET(request: NextRequest) {
  const session = getRequestAdminSession(request);
  if (!session || !session.authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const data = await getPortfolioData();
  return NextResponse.json({
    profileImage: data.profile.profileImage || '',
    name: data.profile.name,
  });
}

/**
 * PUT /api/admin/profile/photo
 * Updates the user's profile photo URL
 */
export async function PUT(request: NextRequest) {
  const session = getRequestAdminSession(request);
  if (!session || !session.authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    let { profileImage } = body;

    if (typeof profileImage !== 'string') {
      return NextResponse.json({ error: 'Invalid profileImage string.' }, { status: 400 });
    }

    profileImage = profileImage.trim();

    // If Google Drive link, convert to direct high-res thumbnail
    if (profileImage && isGoogleDriveUrl(profileImage)) {
      profileImage = getDriveThumbnailUrl(profileImage, 1200);
    }

    const updatedProfile = await updateProfile({ profileImage });
    return NextResponse.json({
      success: true,
      profileImage: updatedProfile.profileImage,
      message: 'Profile photo updated successfully.',
    });
  } catch (error) {
    console.error('Update profile photo error:', error);
    return NextResponse.json({ error: 'Failed to update profile photo.' }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/profile/photo
 * Deletes / removes the user's profile photo
 */
export async function DELETE(request: NextRequest) {
  const session = getRequestAdminSession(request);
  if (!session || !session.authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await updateProfile({ profileImage: '' });
    return NextResponse.json({
      success: true,
      profileImage: '',
      message: 'Profile photo deleted successfully.',
    });
  } catch (error) {
    console.error('Delete profile photo error:', error);
    return NextResponse.json({ error: 'Failed to delete profile photo.' }, { status: 500 });
  }
}
