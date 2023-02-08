import React from 'react';
import { useHistory } from 'react-router-dom';
export default function NotFound() {
  const history = useHistory();
  return (
    <>
      <div className="hero min-h-screen">
        <div className="hero-overlay bg-opacity-60" />
        <div className="hero-content text-center text-neutral-content bg-error">
          <div className="max-w-md">
            <h1 className="mb-5 text-5xl font-bold text-black">404</h1>
            <p className="mb-5 text-black">
              This page straight up doesn&apos;t exist. Try elsewhere.
            </p>
            <button
              className="btn btn-dark w-full"
              onClick={() => {
                history.push('/');
              }}
            >
              Home
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
