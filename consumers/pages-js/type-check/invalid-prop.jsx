// @ts-check
// Editor check: a JavaScript file in a jsconfig project gets the package's types.
import { ButtonContained } from "@mks-ui/core";

export const Bad = () => <ButtonContained colorType="purple">X</ButtonContained>;
export const Good = () => <ButtonContained colorType="secondary">X</ButtonContained>;
