import { FormControl, FormLabel, Text, VStack } from "@chakra-ui/react";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Days, DurationInput, Hours, Minutes } from "../../../DurationInput";
import { AccessRuleFormData } from "../CreateForm";
import { FormStep } from "./FormStep";

export const TimeStep: React.FC = () => {
  const methods = useFormContext<AccessRuleFormData>();
  const time = methods.watch("timeConstraints");
  const maxDurationSeconds = 24 * 3600;

  return (
    <FormStep
      heading="Time"
      subHeading="How long can access be requested for?"
      fields={["timeConstraints.maxDurationSeconds"]}
      preview={
        <VStack width={"100%"} align="flex-start">
          <Text textStyle={"Body/Medium"} color="neutrals.600">
            Max duration:{" "}
            {time?.maxDurationSeconds
              ? Math.floor(time.maxDurationSeconds / 60 / 60) +
                " hours " +
                ((time.maxDurationSeconds / 60) % 60) +
                " minutes"
              : ""}
          </Text>
        </VStack>
      }
    >
      <FormControl
        isInvalid={
          !!methods.formState.errors.timeConstraints?.maxDurationSeconds
        }
      >
        <FormLabel htmlFor="timeConstraints.maxDurationSeconds">
          <Text textStyle={"Body/Medium"}>Maximum Duration </Text>
        </FormLabel>
        <Controller
          control={methods.control}
          rules={{
            required: "Duration is required.",
            // 6 months in milliseconds
            max: true ? 15778476000 : maxDurationSeconds,
            min: 60,
          }}
          name="timeConstraints.maxDurationSeconds"
          render={({ field: { ref, ...rest } }) => {
            return (
              <>
                <DurationInput
                  {...rest}
                  // @TODO: UNDO ME
                  // max={maxDurationSeconds}
                  max={3600 * 36}
                  min={60}
                  defaultValue={3600}
                >
                  <Months />
                  <Weeks />
                  <Days />
                  <Hours />
                  <Minutes />
                </DurationInput>
                curr: {rest.value}
                <br />
                max: {3600 * 36}
              </>
            );
          }}
        />
      </FormControl>
    </FormStep>
  );
};
