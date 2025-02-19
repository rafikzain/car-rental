
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "react-router-dom";

interface SignupFormProps {
  onSubmit: (e: React.FormEvent) => Promise<void>;
  name: string;
  setName: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  confirmEmail: string;
  setConfirmEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  confirmPassword: string;
  setConfirmPassword: (value: string) => void;
  userType: string;
  setUserType: (value: string) => void;
  isLoading: boolean;
}

const SignupForm = ({
  onSubmit,
  name,
  setName,
  email,
  setEmail,
  confirmEmail,
  setConfirmEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  userType,
  setUserType,
  isLoading,
}: SignupFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">
          Full Name
        </label>
        <Input
          id="name"
          type="text"
          placeholder="Enter your full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="confirmEmail" className="text-sm font-medium">
          Confirm Email
        </label>
        <Input
          id="confirmEmail"
          type="email"
          placeholder="Confirm your email"
          value={confirmEmail}
          onChange={(e) => setConfirmEmail(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium">
          Password
        </label>
        <Input
          id="password"
          type="password"
          placeholder="Create a password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="confirmPassword" className="text-sm font-medium">
          Confirm Password
        </label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="userType" className="text-sm font-medium">
          I want to
        </label>
        <Select onValueChange={setUserType} required>
          <SelectTrigger className="bg-background border-input">
            <SelectValue placeholder="Select your primary interest" />
          </SelectTrigger>
          <SelectContent className="bg-background border-2 shadow-lg">
            <SelectItem value="buyer">Reserve Cars</SelectItem>
            <SelectItem value="seller">Sell Cars</SelectItem>
            <SelectItem value="both">Reserve and Sell Cars</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Creating account..." : "Create account"}
      </Button>
      <p className="text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link to="/login" className="text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
};

export default SignupForm;
