import { useState } from "react";
import { Link } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import logo from "@/assets/logo.png";
import "@fontsource/manufacturing-consent/400.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

const signupSchema = z.object({
  fullName: z.string().trim().min(1, "Full name is required").max(100),
  email: z.string().trim().email("Invalid email address").max(255),
  password: z.string().min(6, "Password must be at least 6 characters").max(128),
  phone: z.string().trim().min(10, "Phone number must be at least 10 digits").max(15),
  city: z.string().trim().min(1, "City is required").max(100),
  exam: z.string().min(1, "Please select an exam"),
  yearOfAppearing: z.string().trim().min(4, "Year is required").max(4),
  currentCoaching: z.string().trim().max(200).optional(),
});

type SignupFormValues = z.infer<typeof signupSchema>;

const exams = ["JEE", "NEET", "UPSC", "SSC", "SAT", "GATE", "CAT", "CLAT", "NDA", "Other"];

const Signup = () => {
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      phone: "",
      city: "",
      exam: "JEE",
      yearOfAppearing: "",
      currentCoaching: "",
    },
  });

  const onSubmit = (data: SignupFormValues) => {
    console.log("Signup submitted:", { ...data, password: "[REDACTED]" });
  };

  return (
    <div className="min-h-screen newspaper-bg">
      {/* Header Bar */}
      <header className="border-b-2 border-primary px-4 py-3 md:px-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img
              src={logo}
              alt="Pariksha Samachar Logo"
              className="h-12 w-12 rounded-full object-cover"
            />
            <h1
              className="text-xl font-bold tracking-tight text-primary md:text-2xl"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Pariksha Samachar
            </h1>
          </Link>
          <Link to="/">
            <Button
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold"
            >
              Login
            </Button>
          </Link>
        </div>
      </header>

      {/* Signup Form */}
      <div className="mx-auto max-w-xl px-4 py-10 md:px-8">
        <div className="rounded-sm border border-primary/20 bg-card p-6 md:p-10">
          <h2
            className="mb-1 text-2xl font-bold text-primary md:text-3xl"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Signup
          </h2>
          <p className="mb-6 text-sm text-accent" style={{ fontFamily: "'Lora', serif" }}>
            Fill all mandatory placeholders. Your selected exam decides your next page.
          </p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Full name (mandatory)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input type="email" placeholder="Email (mandatory)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input type="password" placeholder="Create Password (mandatory)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input type="tel" placeholder="Phone number (mandatory)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="City (mandatory)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="exam"
                render={({ field }) => (
                  <FormItem>
                    <p className="text-sm font-semibold text-primary" style={{ fontFamily: "'Lora', serif" }}>
                      Exam you are preparing for (mandatory)
                    </p>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select exam" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {exams.map((exam) => (
                          <SelectItem key={exam} value={exam}>
                            {exam}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="yearOfAppearing"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Year of appearing exam (mandatory)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="currentCoaching"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Current coaching (optional)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-base py-5"
              >
                Create account
              </Button>
            </form>
          </Form>

          <p className="mt-4 text-center text-sm text-muted-foreground" style={{ fontFamily: "'Lora', serif" }}>
            Already have an account?{" "}
            <Link to="/" className="font-semibold text-primary underline underline-offset-4 hover:text-accent">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
