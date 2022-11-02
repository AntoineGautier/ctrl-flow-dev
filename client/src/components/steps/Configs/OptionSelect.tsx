import { Fragment, ChangeEvent } from "react";
import { useStores } from "../../../data";

import { OptionInterface } from "../../../data/template";
import { FlatConfigOption } from "./SlideOut";

export interface OptionSelectProps {
  index: number;
  option: FlatConfigOption;
  configId: string;
  updateSelectedConfigOption: (
    modelicaPath: string,
    // name: string,
    // selectedOption: OptionInterface,
    choice: string | null,
  ) => void;
}

const OptionSelect = ({
  index,
  option,
  configId,
  updateSelectedConfigOption,
}: OptionSelectProps) => {

  function selectOption(event: ChangeEvent<HTMLSelectElement>) {
    // const selectedOption = option.choices?.find(
    //   (choice) => choice.modelicaPath === event.target.value,
    // );

    updateSelectedConfigOption(
      option.modelicaPath,
      event.target.value || null,
    );

    // if (selectedOption) {
    //   updateSelectedConfigOption(
    //     option.modelicaPath,
    //     option.name,
    //     selectedOption,
    //   );
    // }
  }

  return (
    <Fragment>
      <label>
        {index}. {option.name}
      </label>
      <select
        name={option.modelicaPath}
        defaultValue={option.value || ''}
        onChange={selectOption}
      >
        <option value=''></option>
        {option.choices?.map((choice) => (
          <option key={choice.modelicaPath} value={choice.modelicaPath}>
            {choice.name}
          </option>
        ))}
      </select>
    </Fragment>
  );
};

export default OptionSelect;
