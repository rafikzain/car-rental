interface UserDetailsProps {
  location?: string;
  phoneNumber?: string;
  createdAt: Date;
  userType: string;
}

export default function UserDetails({ location, phoneNumber, createdAt, userType }: UserDetailsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <p className="text-sm text-muted-foreground">Location</p>
        <p>{location || 'Not specified'}</p>
      </div>
      <div>
        <p className="text-sm text-muted-foreground">Phone</p>
        <p>{phoneNumber || 'Not specified'}</p>
      </div>
      <div>
        <p className="text-sm text-muted-foreground">Member Since</p>
        <p>{createdAt.toLocaleDateString()}</p>
      </div>
      <div>
        <p className="text-sm text-muted-foreground">User Type</p>
        <p className="capitalize">{userType}</p>
      </div>
    </div>
  );
}