import React from "react";
import { FormElements } from "./FormElements";
import SidebarBtnElement from "./SidebarBtnElement";
import useDesigner from "./hooks/useDesigner";
import FormElementsSidebar from "./FormElementsSidebar";
import ProppertiesFormSidebar from "./ProppertiesFormSidebar";

function DesignerSideBar() {
  const { selectedElement } = useDesigner();
  return (
    <aside
      className="w-[400px] max-w-[400px] flex flex-col grow gap-2 border-l-2 border-muted
    p-4 bg-background overflow-y-auto h-full"
    >
      {!selectedElement && <FormElementsSidebar />}
      {selectedElement && <ProppertiesFormSidebar />}
    </aside>
  );
}

export default DesignerSideBar;
