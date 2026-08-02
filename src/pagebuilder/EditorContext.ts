import { createContext, useContext } from "react";

export interface EditorCtx {
  editing: boolean;
  /** Update a single prop on the block currently being rendered. */
  setProp: (key: string, value: unknown) => void;
  /** Update a field inside a list prop item. */
  setListItemProp: (listKey: string, index: number, key: string, value: unknown) => void;
}

const noop = () => undefined;

export const EditorContext = createContext<EditorCtx>({
  editing: false,
  setProp: noop,
  setListItemProp: noop,
});

export const useEditor = () => useContext(EditorContext);
