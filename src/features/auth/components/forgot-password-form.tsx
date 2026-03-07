import * as React from "react";
import z from "zod";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { Link } from "@tanstack/react-router";
import { MailIcon } from "lucide-react";
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
});

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [succeeded, setSucceeded] = React.useState(false);

  const form = useForm({
    defaultValues: {
      email: "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      const { error } = await authClient.requestPasswordReset({
        email: value.email,
        redirectTo: ROUTES.RESET_PASSWORD,
      });

      if (error) {
        toast.error(error.message ?? "Something went wrong");
        return;
      }

      setSucceeded(true);
    },
  });

  if (succeeded) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-muted">
              <MailIcon className="size-6" />
            </div>
            <CardTitle className="text-xl">{m.auth_forgot_password_success_title()}</CardTitle>
            <CardDescription>{m.auth_forgot_password_success_description()}</CardDescription>
          </CardHeader>
          <CardContent />
        </Card>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">{m.auth_forgot_password_title()}</CardTitle>
          <CardDescription>{m.auth_forgot_password_description()}</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            id="forgot-password-form"
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
                      <FieldLabel htmlFor={field.name}>{m.auth_forgot_password_email_label()}</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        type="email"
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder={m.auth_forgot_password_email_placeholder()}
                        autoComplete="email"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />
              <Field>
                <Button type="submit" form="forgot-password-form">{m.auth_forgot_password_action_submit()}</Button>
                <FieldDescription className="text-center">
                  <Link to={ROUTES.SIGN_IN}>{m.auth_forgot_password_action_back()}</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
