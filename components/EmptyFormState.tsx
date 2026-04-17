import CreateFormBtn from "./CreateFormBtn";

export default function EmptyFormsState() {
  return (
    <div className="flex flex-col items-center justify-center col-span-full py-20 text-center">
      <h2 className="text-2xl font-semibold mb-2">No forms created yet</h2>
      <p className="text-muted-foreground mb-6">
        Start by creating your first form to collect responses.
      </p>
      <CreateFormBtn />
    </div>
  );
}
