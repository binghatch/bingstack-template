import z from "zod";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { Link } from "@tanstack/react-router";
import { ROUTES } from "routes";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { m } from "@/i18n/messages";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

const formSchema = z.object({
  fullName: z.string().min(1, {
    message: "Full Name is required",
  }),
  email: z.email(),
  password: z.string().min(6, {
    message: "Minimum 6 characters required",
  }),
  passwordConfirmation: z.string(),
})
.refine((data) => {
  if (data.password !== data.passwordConfirmation) {
    return false;
  }

  return true;
}, {
  message: "Both passwords have to match",
  path: ["passwordConfirmation"],
});

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const form = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      passwordConfirmation: "",
    },
    validators: {
      onSubmit: formSchema
    },
    onSubmit: async ({ value }) => {
      const { data, error } = await authClient.signUp.email({
        email: value.email,
        password: value.password,
        name: `${value.fullName}`,
      })

      if (error) {
        toast.error(error.message ?? "Something went wrong")
        return
      }

      toast.success("Account created!")
      console.log(data);
    },
  })

  return (
  <div className={cn("flex flex-col gap-6", className)} {...props}>
    <Card>
      <CardHeader className="text-center">
          <CardTitle className="text-xl">{m.auth_signup_title()}</CardTitle>
        <CardDescription>
          {m.auth_signup_description()}
        </CardDescription>
      </CardHeader>
      <CardContent>
          <form
            id="signup-form"
            onSubmit={(e) => {
              e.preventDefault()
              form.handleSubmit()
            }}
          >
            <FieldGroup>
              <form.Field
                name="fullName"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>{m.auth_signup_full_name_label()}</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder={m.auth_signup_full_name_placeholder()}
                        autoComplete="off"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  )
                }}
              />

              <form.Field
                name="email"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>{m.auth_signup_email_label()}</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        type="email"
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder={m.auth_signup_email_placeholder()}
                        autoComplete="off"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  )
                }}
              />

              <Field className="grid grid-cols-2 gap-4">
                <form.Field
                  name="password"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>{m.auth_signup_password_label()}</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          type="password"
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          placeholder={m.auth_signup_password_placeholder()}
                          autoComplete="off"
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    )
                  }}
                />

                <form.Field
                  name="passwordConfirmation"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>{m.auth_signup_confirm_password_label()}</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          type="password"
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          placeholder={m.auth_signup_confirm_password_placeholder()}
                          autoComplete="off"
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    )
                  }}
                />
              </Field>
              <Field>
                <Button type="submit" form="signup-form">{m.auth_signup_action_submit()}</Button>
                <FieldDescription className="text-center">
                  <span>{m.auth_signup_footer_has_account()}</span>
                  {" "}
                  <Link to={ROUTES.SIGN_IN}>{m.auth_signup_footer_signin()}</Link>
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
  )

}
