"use client";

import { useEffect, useState } from "react";
import Heading from "../components/Heading";
import Input from "../components/inputs/Input";
import {useForm} from "react-hook-form";
import Button from "../components/Button";
import Link from "next/link";
import { AiOutlineGoogle } from "react-icons/ai";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const LoginForm = ({currentUser}) => {

    const [isLoading, setIsLoading] = useState(false);
    const {register, handleSubmit, formState: {errors}} = useForm({
        defaultValues:{
            email:"",
            password:"",
        }
    });

    const router = useRouter();

    useEffect(() => {
        if(currentUser){
            router.push("/cart");
            router.refresh();
        }
    }, []);

    const onSubmit = (data)=>{
        setIsLoading(true);

        signIn("credentials", {
            ...data,
            redirect: false,
        }).then((callback) => {
            setIsLoading(false);

            if(callback?.ok){
                router.push("/cart");
                router.refresh()
                toast.success("Logged In");
            };

            if(callback?.error){
                toast.error(callback.error);
            };
        })
    }

    if(currentUser){
        return <p className="text-center">Logged In. Redirecting...</p>;
    }

    return ( 
        <>
            <Heading title="Sign In to E-Shop" />
            <Button outline label="Continue with Google" icon={AiOutlineGoogle} onClick={() =>{signIn("google")}} />

            <hr className="bg-slate-300 w-full h-px" />

            <Input id="email" label="Email" disabled={isLoading} register={register} errors={errors} required />

            <Input id="password" label="Password" disabled={isLoading} register={register} errors={errors} required type="password" />

            <Button label={isLoading ? "Loading" : "Login"} onClick={handleSubmit(onSubmit)} />

            <p className="text-sm">
                Don't have an account?{""}
                <Link href="/register" className="underline font-semibold">Sign Up</Link>
            </p>
        </>
     );
}
 
export default LoginForm;