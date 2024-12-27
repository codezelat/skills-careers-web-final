"use client";

import { useRef } from "react";

async function signupNewsletter(email) {
  const response = await fetch("/api/newsletter", {
    method: "POST",
    body: JSON.stringify({
      email,
    }),
    headers: {
      "Content-Type": "application/JSON",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

function NewsLetter() {
  const emailInputRef = useRef();

  async function submitHandler(event) {
    event.preventDefault();

    const enteredEmail = emailInputRef.current.value;

    try {
      const result = await signupNewsletter(enteredEmail);
      console.log(result);
      alert(result.message);
    } catch (error) {
      console.log(error.message);
      alert(error.message);
    }
  }
  return (
    <div>
      <p className="text-base font-bold text-black mb-1">Join NewsLetter</p>
      <form onSubmit={submitHandler}>
        <input
          id="email"
          type="email"
          placeholder="Enter Email"
          ref={emailInputRef}
          className="px-2 py-1 w-96 border-solid border-2 border-gray-400 outline-none rounded mb-4"
        />
        <button className="px-2 py-1 ms-4 border-2 border-blue-950 text-blue-950 hover:bg-blue-950 hover:text-white rounded transition-colors">
          Submit
        </button>
      </form>
    </div>
  );
}

export default NewsLetter;
