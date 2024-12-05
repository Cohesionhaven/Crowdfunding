import React from 'react';
import { useUser } from '@clerk/clerk-react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { User, Wallet, Edit } from 'lucide-react';

export const UserProfile: React.FC = () => {
  const { user } = useUser();
  const [isEditing, setIsEditing] = React.useState(false);
  
  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      const response = await fetch(`/api/users/${user?.id}`);
      if (!response.ok) throw new Error('Failed to fetch profile');
      return response.json();
    },
    enabled: !!user?.id,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Profile Information</h2>
            <Button
              variant="outline"
              onClick={() => setIsEditing(!isEditing)}
            >
              <Edit className="w-4 h-4 mr-2" />
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <img
                src={profile?.avatarUrl || user?.imageUrl}
                alt="Profile"
                className="w-20 h-20 rounded-full"
              />
              <div>
                <h3 className="text-xl font-semibold">{user?.fullName}</h3>
                <p className="text-gray-600">{user?.primaryEmailAddress?.emailAddress}</p>
              </div>
            </div>

            {isEditing ? (
              <form className="space-y-4">
                <Input
                  label="Username"
                  defaultValue={profile?.username}
                  placeholder="Enter username"
                />
                <Input
                  label="Bio"
                  defaultValue={profile?.bio}
                  placeholder="Tell us about yourself"
                />
                <Button type="submit">Save Changes</Button>
              </form>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Username</label>
                  <p className="mt-1">{profile?.username || 'Not set'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Bio</label>
                  <p className="mt-1">{profile?.bio || 'No bio yet'}</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold">Wallet Information</h2>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Wallet className="w-5 h-5 text-gray-600" />
              <span className="font-medium">
                {profile?.walletAddress
                  ? `${profile.walletAddress.slice(0, 6)}...${profile.walletAddress.slice(-4)}`
                  : 'No wallet connected'}
              </span>
            </div>
            <Button variant="outline">
              {profile?.walletAddress ? 'Disconnect' : 'Connect Wallet'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};