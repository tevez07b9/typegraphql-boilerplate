import { withUrqlClient } from "next-urql";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import Layout from "../components/Layout";
import { LoginMutationVariables, useLoginMutation } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";

const Login = () => {
  const { handleSubmit, control } = useForm();
  const [_, login] = useLoginMutation();

  return (
    <Layout>
      <div className="w-full flex justify-center">
        <form
          onSubmit={handleSubmit((data) =>
            login(data as LoginMutationVariables)
          )}
          className="p-4 w-80 bg-gray-200 rounded-md"
        >
          <h1 className="text-xl font-semibold mb-4">Login</h1>

          <div className="flex flex-col mb-2">
            <label htmlFor="" className="mb-2">
              Username/Email
            </label>
            <Controller
              control={control}
              name="usernameOrEmail"
              render={({ field }) => (
                <input type="text" className="p-2 rounded-sm" {...field} />
              )}
            />
          </div>

          <div className="flex flex-col mb-2">
            <label htmlFor="" className="mb-2">
              Password
            </label>
            <Controller
              control={control}
              name="password"
              render={({ field }) => (
                <input type="password" className="p-2 rounded-sm" {...field} />
              )}
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-purple-400 mt-2 rounded-md"
          >
            Login
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(Login);
