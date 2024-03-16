import MenuOptions from "@/components/LeftSide/MenuOptions";
import MiddleComponent from "@/components/Middle/MiddleComponent";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div>
      <div className="flex w-full">
        <MenuOptions />
        <div className="h-[90vh] overflow-y-auto lg:w-2/4 md:w-3/5 py-5 mx-4 px-4">
          <MiddleComponent />
        </div>
      </div>
    </div>
  );
}
