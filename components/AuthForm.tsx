"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form
} from "@/components/ui/form"

import Image from "next/image"
import Link from "next/link"
import { toast } from "sonner"
import FormFiled from "./FormFiled"
import { useRouter } from "next/navigation"
import { auth } from "@/firebase/client"
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

import { signIn, signUp } from "@/lib/actions/auth.action"




const authFormSchema = (type: FormType) => {
  return z.object({
    name: type === "sign-up" ? z.string().min(3) : z.string().optional(),
    email: z.string().email(),
    password: z.string().min(3),
  });
};

const AuthForm = ({type}: {type:FormType}) => {

  const router =useRouter();

  const formSchema = authFormSchema(type)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })

   const onSubmit = async (data: z.infer<typeof formSchema>) => {
    console.log("test104")
    try {
      console.log("test105")
      if (type === "sign-up") {
        const { name, email, password } = data;
        console.log("data", data);
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        console.log("userCredential", userCredential);
        const result = await signUp({
          uid: userCredential.user.uid,
          name: name!,
          email,
          password,
        });

        if (!result.success) {
          toast.error(result.message);
          return;
        }

        toast.success("Account created successfully. Please sign in.");
        router.push("/sign-in");
      } else {
        const { email, password } = data;

        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

        const idToken = await userCredential.user.getIdToken();
        if (!idToken) {
          toast.error("Sign in Failed. Please try again.");
          return;
        }

        await signIn({
          email,
          idToken,
        });

        toast.success("Signed in successfully.");
        router.push("/");
      }
    } catch (error) {
      console.log(error);
      toast.error(`There was an error: ${error}`);
    }
  };


  const isSignIn = type === "sign-in"

  return (
    <div className="card-border lg:min-w-[566px]">
      <div className="flex flex-col gap-6 card py-14 px-10">
        <div className="flex flex-row gap-2 justify-center">
          <Image
            src="/logo.svg"
            alt="logo"
            width={32}
            height={38}
          />
          <h2 className="text-primary-100">Prep Wise</h2>
        </div>
        <h3>Practice job interview withe AI</h3>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6 mt-4 form">
              {!isSignIn && (
                <FormFiled 
                    control={form.control} 
                    name="name" label="Name" 
                    placeholder="Your Name"
                />)}
              <FormFiled 
                    control={form.control} 
                    name="email" label="Email" 
                    placeholder="Your Email address"
                    type="email"
                />
              <FormFiled 
                    control={form.control} 
                    name="password" label="Password" 
                    placeholder="Enter Your Password"
                    type="password"
                />

            <Button className="btn" type="submit">{isSignIn?"Sign In":"Create Account"}</Button>
          </form>
          <p className="text-center">
            {isSignIn?"No account yet?":"have an account Already?"}
            <Link href={isSignIn?"/sign-up":"/sign-in"} className="font-bold text-user-primary ml-1">
              {isSignIn?"Sign up":"Sign in"}
            </Link>
          </p>
        </Form>
      </div>
    </div>
  )
}

export default AuthForm