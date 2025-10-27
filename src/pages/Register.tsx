const Register = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="font-bold text-2xl mb-4">Register Page</h1>
      <form className="flex flex-col gap-3 w-64">
        <input type="text" placeholder="Username" className="border p-2 rounded" />
        <input type="email" placeholder="Email" className="border p-2 rounded" />
        <input type="password" placeholder="Password" className="border p-2 rounded" />
        <button className="bg-green-500 text-white p-2 rounded">Register</button>
      </form>
    </div>
  );
};

export default Register;
