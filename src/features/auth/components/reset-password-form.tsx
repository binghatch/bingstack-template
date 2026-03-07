import * as React from "react";
import z from "zod";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { Link } from "@tanstack/react-router";
import { CheckCircleIcon, CircleAlertIcon } from "lucide-react";
import { ROUTES } from "routes";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { m } from "@/i18n/messages";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

const formSchema = z
  .object({
    password: z.string().min(6, { message: "Minimum 6 characters required" }),
    passwordConfirmation: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Both passwords have to match",
    path: ["passwordConfirmation"],
  });

type ResetPasswordFormProps = React.ComponentProps<"div"> & {
  token: string;
};

export function ResetPasswordForm({
  token,
  className,
  ...props
}: ResetPasswordFormProps) {
  const [state, setState] = React.useState<"form" | "success" | "invalid">("form");

  const form = useForm({
    defaultValues: {
      password: "",
      passwordConfirmation: "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      const { error } = await authClient.resetPassword({
        newPassword: value.password,
        token,
      });

      if (error) {
        if (error.code === "INVALID_TOKEN") {
          setState("invalid");
        } else {
          toast.error(error.message ?? "Something went wrong");
        }
        return;
      }

      setState("success");
    },
  });

  if (state === "success") {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-muted">
              <CheckCircleIcon className="size-6" />
            </div>
            <CardTitle className="text-xl">{m.auth_reset_password_success_title()}</CardTitle>
            <CardDescription>{m.auth_reset_password_success_description()}</CardDescription>
          </CardHeader>
          <CardFooter className="justify-center">
            <Link to={ROUTES.SIGN_IN} className="text-sm underline-offset-4 hover:underline">
              {m.auth_signin_action_submit()}
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (state === "invalid") {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-muted">
              <CircleAlertIcon className="size-6" />
            </div>
            <CardTitle className="text-xl">{m.auth_reset_password_error_invalid_link_title()}</CardTitle>
            <CardDescription>{m.auth_reset_password_error_invalid_link_description()}</CardDescription>
          </CardHeader>
          <CardFooter className="justify-center">
            <Link to={ROUTES.FORGOT_PASSWORD} className="text-sm underline-offset-4 hover:underline">
              {m.auth_forgot_password_action_submit()}
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">{m.auth_reset_password_title()}</CardTitle>
          <CardDescription>{m.auth_reset_password_description()}</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            id="reset-password-form"
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            <FieldGroup>
              <form.Field
                name="password"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>{m.auth_reset_password_password_label()}</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        type="password"
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder={m.auth_reset_password_password_placeholder()}
                        autoComplete="new-password"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />
              <form.Field
                name="passwordConfirmation"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>{m.auth_reset_password_confirm_password_label()}</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        type="password"
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder={m.auth_reset_password_confirm_password_placeholder()}
                        autoComplete="new-password"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />
              <Field>
                <Button type="submit" form="reset-password-form">{m.auth_reset_password_action_submit()}</Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
