import {
  Button,
  ChakraProvider,
  Flex,
  Input,
  cookieStorageManager,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { DialogDataProvider, useDialogData } from "./data/useDialogData";
import Workspace from "./flowchart/Workspace";
import theme from "./theme";

function PathSelector() {
  const { path, setPath } = useDialogData();
  const [value, setValue] = useState(path);

  useEffect(() => {
    setValue(path);
  }, [path]);

  return (
    <Flex>
      <Input
        value={value}
        onChange={(e) => setValue(e.currentTarget.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            setPath(value);
          }
        }}
        placeholder="파일 "
      />
      <Button onClick={() => setPath(value)}>Load</Button>
    </Flex>
  );
}

function App() {
  return (
    <ChakraProvider
      colorModeManager={cookieStorageManager}
      theme={theme}
      resetCSS
    >
      <DialogDataProvider>
        <Flex direction={"column"} height={"100vh"} width={"100vw"}>
          <PathSelector />
          <Workspace />
        </Flex>
      </DialogDataProvider>
    </ChakraProvider>
  );
}

export default App;
