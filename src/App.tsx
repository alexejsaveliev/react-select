import { useState } from "react";
import { Select, SelectOption } from "./Select";

const options = [
  { label: "First", value: 1 },
  { label: "Second", value: 2 },
  { label: "Third", value: 3 },
  { label: "Forth", value: 4 },
  { label: "Fifth", value: 5 },
];

function App() {
  const [value1, setValue1] = useState<SelectOption | undefined>(options[0]);
  const [value2, setValue2] = useState<SelectOption[]>([options[0]]);

  const onChange = (option: SelectOption | undefined) => setValue1(option);

  return (
    <>
      <Select options={options} onChange={(o) => setValue1(o)} value={value1} />
      <br />
      <Select
        isMultiple
        options={options}
        onChange={(o) => setValue2(o)}
        value={value2}
      />
    </>
  );
}

export default App;
