import React from "react";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";

const Navbar = () => {
  const [{ data, fetching }] = useMeQuery();
  const [_, logout] = useLogoutMutation();

  if (!fetching && !data?.me) {
    return <div className="bg-gray-300 px-6 py-3">Login</div>;
  }

  if (data?.me) {
    return (
      <div className="bg-gray-300 px-6 py-3">
        {data.me.username}
        <button
          onClick={() => logout()}
          className="ml-2 px-6 py-2 bg-purple-400 mt-2 rounded-md"
        >
          Logout
        </button>
      </div>
    );
  }

  return <></>;
};

export default Navbar;
