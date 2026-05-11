import UserSearchComponent from "./components/userSearchComponent";

export default async function Home() {
  return (
    <div>
      <main className="flex flex-col w-[35%] justify-center m-auto p-4">
        <h1 className="text-3xl font-bold text-center pt-6">
          Hammock Movie search
        </h1>
        <UserSearchComponent />
      </main>
    </div>
  );
}
