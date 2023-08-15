import { ChakraProvider, Flex } from "@chakra-ui/react";
import { ReactFlowProvider } from "reactflow";
import Config from "./Config";
import Flowchart from "./flowchart/Flowchart";
import { NodeDataProvider } from "./flowchart/useNodeData";
import theme from "./theme";

function App() {
  return (
    <ChakraProvider theme={theme} resetCSS>
      <NodeDataProvider>
        <ReactFlowProvider>
          <Flex direction={"column"} height={"100vh"} width={"100vw"}>
            <Config />
            <Flowchart />
          </Flex>
        </ReactFlowProvider>
      </NodeDataProvider>
    </ChakraProvider>
  );
}

export default App;
