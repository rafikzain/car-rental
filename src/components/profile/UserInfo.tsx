import { User } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface UserInfoProps {
  user: User;
}

export default function UserInfo({ user }: UserInfoProps) {
  const { toast } = useToast();

  const handleReport = async () => {
    toast({
      title: "User Reported",
      description: "Thank you for your report. We will review it shortly.",
    });
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{user.name}'s Profile</span>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Report User</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Report User</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to report this user? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleReport}>Report</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Location</p>
            <p>{user.location || 'Not specified'}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Phone</p>
            <p>{user.phoneNumber || 'Not specified'}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Member Since</p>
            <p>{user.createdAt.toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">User Type</p>
            <p className="capitalize">{user.userType}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}