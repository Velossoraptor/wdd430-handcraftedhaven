import { verifySession } from "@/_lib/session";
import { NewProductPage } from "./addItem";

export default async function Page() {
  const session = await verifySession();
  const id = session?.id;
  return <NewProductPage id={id} />;
}
