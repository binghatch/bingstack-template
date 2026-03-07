import * as React from "react";
import z from "zod";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { Link, useNavigate } from "@tanstack/react-router";
import { ROUTES } from "routes";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { m } from "@/i18n/messages";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

const formSchema = z.object({
  email: z.email(),
  password: z.string().min(1, {
    message: "Password is required",
  }),
});

export function SigninForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const navigate = useNavigate();
  const [isLoadingGoogle, setIsLoadingGoogle] = React.useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoadingGoogle(true);
    await authClient.signIn.social({ provider: "google" });
    setIsLoadingGoogle(false);
  };

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      const { error } = await authClient.signIn.email({
        email: value.email,
        password: value.password,
      });

      if (error) {
        if (error.code === "EMAIL_NOT_VERIFIED") {
          await authClient.sendVerificationEmail({ email: value.email });
          navigate({ to: ROUTES.VERIFY_EMAIL, search: { resent: true } });
          return;
        }
        toast.error(error.message ?? "Something went wrong");
        return;
      }

      navigate({ to: ROUTES.HOME });
    },
  });

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">{m.auth_signin_title()}</CardTitle>
          <CardDescription>
            {m.auth_signin_description()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            id="signin-form"
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            <FieldGroup>
              <form.Field
                name="email"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>{m.auth_signin_email_label()}</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        type="email"
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder={m.auth_signin_email_placeholder()}
                        autoComplete="email"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />

              <form.Field
                name="password"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <div className="flex items-center justify-between">
                        <FieldLabel htmlFor={field.name}>{m.auth_signin_password_label()}</FieldLabel>
                        <Link
                          to={ROUTES.FORGOT_PASSWORD}
                          className="text-sm underline-offset-4 hover:underline"
                        >
                          {m.auth_signin_action_forgot_password()}
                        </Link>
                      </div>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        type="password"
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder={m.auth_signin_password_placeholder()}
                        autoComplete="current-password"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />

              <Field>
                <Button type="submit" form="signin-form">{m.auth_signin_action_submit()}</Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGoogleSignIn}
                  disabled={isLoadingGoogle}
                >
                  <img src="/google.svg" alt="Google" className="size-4" />
                  {m.auth_signin_action_google()}
                </Button>
                <FieldDescription className="text-center">
                  <span>{m.auth_signin_footer_no_account()}</span>
                  {" "}
                  <Link to={ROUTES.SIGN_UP}>{m.auth_signin_footer_signup()}</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}
