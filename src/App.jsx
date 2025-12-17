import { supabase } from "./lib/supabase";

function App() {
  console.log("supabase");
  console.log(supabase);
  return (
    <div className="flex justify-content-around bg-black">
      <h1 className=""> Hello </h1>
      <p className="text-black">ajsdflajsdfljasldfjalsdjfaklsdjflkasjdfj</p>
    </div>
  );
}

export default App;
