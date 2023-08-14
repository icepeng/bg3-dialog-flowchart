import { ChakraProvider, Flex } from "@chakra-ui/react";
import Config from "./Config";
import Flowchart from "./flowchart/Flowchart";
import { NodeDataProvider } from "./flowchart/useNodeData";
import { ReactFlowProvider } from "reactflow";

function App() {
  return (
    <ChakraProvider>
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
