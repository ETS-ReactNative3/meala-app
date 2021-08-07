import * as React from 'react';
import { ScrollView, Text } from 'react-native';
import { DataTable } from 'react-native-paper';
import dayjs from 'dayjs';
import Healthkit, {
  HKCategoryTypeIdentifier,
  HKCharacteristicTypeIdentifier,
  HKCorrelationTypeIdentifier,
  HKInsulinDeliveryReason,
  HKQuantitySample,
  HKQuantityTypeIdentifier,
  HKStatisticsOptions,
  HKUnit,
  HKWeatherCondition,
  HKWorkoutActivityType,
} from '@kingstinct/react-native-healthkit';

const DisplayWorkout: React.FunctionComponent = ({ workout }) => {
  return (
    <DataTable.Row accessibilityStates={[]}>
      <DataTable.Cell accessibilityStates={[]}>
        {HKWorkoutActivityType[workout.workoutActivityType]}
      </DataTable.Cell>
      <DataTable.Cell style={{ paddingRight: 10 }} accessibilityStates={[]} numeric>
        {workout ? workout.duration.toFixed(0) + 's' : '-'}
      </DataTable.Cell>
      <DataTable.Cell accessibilityStates={[]}>
        {workout ? workout.totalDistance?.quantity.toFixed(1) + ' ' + workout.totalDistance?.unit : '-'}
      </DataTable.Cell>
      <DataTable.Cell accessibilityStates={[]}>
        {workout
          ? workout.totalEnergyBurned?.quantity.toFixed(1) + ' ' + workout.totalEnergyBurned?.unit
          : '-'}
      </DataTable.Cell>
    </DataTable.Row>
  );
};

const DisplayQuantitySample: React.FunctionComponent = ({ title, sample }) => {
  return (
    <DataTable.Row accessibilityStates={[]}>
      <DataTable.Cell accessibilityStates={[]}>{title}</DataTable.Cell>
      <DataTable.Cell style={{ paddingRight: 10 }} accessibilityStates={[]} numeric>
        {sample ? sample.quantity.toFixed(1) : '-'}
      </DataTable.Cell>
      <DataTable.Cell accessibilityStates={[]}>{sample ? sample.unit : '-'}</DataTable.Cell>
      <DataTable.Cell accessibilityStates={[]}>
        {sample ? sample.startDate.toLocaleTimeString() : '-'}
      </DataTable.Cell>
    </DataTable.Row>
  );
};

const DisplayCategorySample: React.FunctionComponent = ({ title, sample }) => {
  return (
    <DataTable.Row accessibilityStates={[]}>
      <DataTable.Cell accessibilityStates={[]}>{title}</DataTable.Cell>
      <DataTable.Cell style={{ paddingRight: 10 }} accessibilityStates={[]} numeric>
        {sample ? sample.value : '-'}
      </DataTable.Cell>
      <DataTable.Cell accessibilityStates={[]}>
        {sample ? sample.startDate.toLocaleTimeString() : '-'}
      </DataTable.Cell>
      <DataTable.Cell accessibilityStates={[]}>
        {sample ? sample.endDate.toLocaleTimeString() : '-'}
      </DataTable.Cell>
    </DataTable.Row>
  );
};

const DisplayStat: React.FunctionComponent = ({ title, sample }) => {
  return (
    <DataTable.Row accessibilityStates={[]}>
      <DataTable.Cell accessibilityStates={[]}>{title}</DataTable.Cell>
      <DataTable.Cell style={{ paddingRight: 10 }} accessibilityStates={[]} numeric>
        {sample ? sample.quantity.toFixed(1) : '-'}
      </DataTable.Cell>
      <DataTable.Cell accessibilityStates={[]}>{sample ? sample.unit : '-'}</DataTable.Cell>
      <DataTable.Cell accessibilityStates={[]}>N/A</DataTable.Cell>
    </DataTable.Row>
  );
};

function DataView() {
  const [dateOfBirth, setDateOfBirth] = React.useState(null);

  const [bloodGlucoseSamples, setBloodGlucoseSamples] = React.useState(null);

  const bodyFat = Healthkit.useMostRecentQuantitySample(HKQuantityTypeIdentifier.bodyFatPercentage);

  const bloodGlucose = Healthkit.useMostRecentQuantitySample(HKQuantityTypeIdentifier.bloodGlucose);
  const insulin = Healthkit.useMostRecentQuantitySample(HKQuantityTypeIdentifier.insulinDelivery);
  const carbs = Healthkit.useMostRecentQuantitySample(HKQuantityTypeIdentifier.dietaryCarbohydrates);

  const bodyWeight = Healthkit.useMostRecentQuantitySample(HKQuantityTypeIdentifier.bodyMass);
  const heartRate = Healthkit.useMostRecentQuantitySample(HKQuantityTypeIdentifier.heartRate);
  const lastWorkout = Healthkit.useMostRecentWorkout();
  const lastMindfulSession = Healthkit.useMostRecentCategorySample(HKCategoryTypeIdentifier.mindfulSession);

  const [queryStatisticsResponse, setQueryStatisticsResponse] = React.useState(null);

  React.useEffect(() => {
/*    Healthkit.saveQuantitySample(HKQuantityTypeIdentifier.insulinDelivery, HKUnit.InternationalUnit, 4.2, {
      metadata: {
        HKInsulinDeliveryReason: HKInsulinDeliveryReason.basal,
      },
    });
    Healthkit.saveCorrelationSample(HKCorrelationTypeIdentifier.food, [
      {
        quantityType: HKQuantityTypeIdentifier.dietaryCaffeine,
        unit: HKUnit.Grams,
        quantity: 1,
        metadata: {},
      },
      {
        quantityType: HKQuantityTypeIdentifier.dietaryEnergyConsumed,
        unit: HKUnit.Kilocalories,
        quantity: 1,
        metadata: {},
      },
    ]);

    Healthkit.saveWorkoutSample(
      HKWorkoutActivityType.archery,
      [
        {
          quantityType: HKQuantityTypeIdentifier.activeEnergyBurned,
          unit: HKUnit.Kilocalories,
          quantity: 63,
          metadata: {},
        },
        {
          quantityType: HKQuantityTypeIdentifier.appleExerciseTime,
          unit: HKUnit.Minutes,
          quantity: 11,
          metadata: {},
        },
      ],
      new Date(),
      {
        metadata: {
          HKWeatherCondition: HKWeatherCondition.hurricane,
        },
      },
    );

    Healthkit.getDateOfBirth().then(setDateOfBirth);*/

    Healthkit.queryStatisticsForQuantity(
      HKQuantityTypeIdentifier.heartRate,
      [HKStatisticsOptions.discreteAverage, HKStatisticsOptions.discreteMax, HKStatisticsOptions.discreteMin],
      dayjs().startOf('day').toDate(),
    ).then(setQueryStatisticsResponse);

    Healthkit.queryQuantitySamples(HKQuantityTypeIdentifier.bloodGlucose, {
      ascending: true,
      from: dayjs().startOf('day').toDate(),
      to: new Date(),
    }).then(setBloodGlucoseSamples);
  }, []);

  return (
    <ScrollView style={{ flex: 1, paddingTop: 40 }}>
      <Text>Date of birth: {dateOfBirth?.toLocaleDateString()}</Text>
      <DataTable>
        <DataTable.Header accessibilityStates={[]}>
          <DataTable.Title accessibilityStates={[]}>Metric</DataTable.Title>
          <DataTable.Title accessibilityStates={[]} style={{ paddingRight: 10 }} numeric>
            Value
          </DataTable.Title>
          <DataTable.Title accessibilityStates={[]}>Unit</DataTable.Title>
          <DataTable.Title accessibilityStates={[]}>Time</DataTable.Title>
        </DataTable.Header>

        <DisplayQuantitySample sample={bodyFat} title="Body fat" />
        <DisplayQuantitySample sample={bodyWeight} title="Weight" />
        <DisplayQuantitySample sample={heartRate} title="Heart rate" />
        <DisplayQuantitySample sample={bloodGlucose} title="Glucose" />
        <DisplayQuantitySample sample={insulin} title="Insulin" />
        <DisplayQuantitySample sample={carbs} title="Carbs" />

        <DisplayStat sample={queryStatisticsResponse?.averageQuantity} title="Avg. HR" />
        <DisplayStat sample={queryStatisticsResponse?.maximumQuantity} title="High HR" />
        <DisplayStat sample={queryStatisticsResponse?.minimumQuantity} title="Low HR" />

        <DisplayCategorySample sample={lastMindfulSession} title="Mindful" />

        <DataTable.Header accessibilityStates={[]}>
          <DataTable.Title accessibilityStates={[]}>Workout</DataTable.Title>
          <DataTable.Title accessibilityStates={[]} style={{ paddingRight: 10 }} numeric>
            Duration
          </DataTable.Title>
          <DataTable.Title accessibilityStates={[]}>Distance</DataTable.Title>
          <DataTable.Title accessibilityStates={[]}>Energy</DataTable.Title>
        </DataTable.Header>
        {lastWorkout ? <DisplayWorkout workout={lastWorkout} /> : null}

        <DataTable.Header accessibilityStates={[]}>
          <DataTable.Title accessibilityStates={[]}>Blood Glucose</DataTable.Title>
          <DataTable.Title accessibilityStates={[]} style={{ paddingRight: 10 }} numeric>
            Value
          </DataTable.Title>
          <DataTable.Title accessibilityStates={[]}>Units</DataTable.Title>
          <DataTable.Title accessibilityStates={[]}>Time</DataTable.Title>
        </DataTable.Header>
        {bloodGlucoseSamples
          ? bloodGlucoseSamples.map((sample: HKQuantitySample) => (
              <DisplayQuantitySample sample={sample} title="Glucose" />
            ))
          : null}
      </DataTable>
    </ScrollView>
  );
}

/*
      </DataTable>*/

const HealthKitTest = () => {
  const [hasPermissions, setHasPermissions] = React.useState(false);
  React.useEffect(() => {
    Healthkit.requestAuthorization(
      [
        HKCharacteristicTypeIdentifier.biologicalSex,
        HKCharacteristicTypeIdentifier.bloodType,
        HKCharacteristicTypeIdentifier.dateOfBirth,
        HKCharacteristicTypeIdentifier.fitzpatrickSkinType,
        HKQuantityTypeIdentifier.waistCircumference,
        HKQuantityTypeIdentifier.bodyMassIndex,
        HKQuantityTypeIdentifier.bodyMass,
        HKQuantityTypeIdentifier.heartRate,
        HKQuantityTypeIdentifier.bloodGlucose,
        HKQuantityTypeIdentifier.insulinDelivery,
        HKQuantityTypeIdentifier.activeEnergyBurned,
        HKCategoryTypeIdentifier.mindfulSession,
        HKQuantityTypeIdentifier.dietaryCaffeine,
        HKQuantityTypeIdentifier.dietaryEnergyConsumed,
        'HKWorkoutTypeIdentifier',
      ],
      [
        HKQuantityTypeIdentifier.waistCircumference,
        HKQuantityTypeIdentifier.activeEnergyBurned,
        HKQuantityTypeIdentifier.bloodGlucose,
        HKQuantityTypeIdentifier.insulinDelivery,
        HKQuantityTypeIdentifier.bodyFatPercentage,
        HKCategoryTypeIdentifier.mindfulSession,
        HKQuantityTypeIdentifier.dietaryCaffeine,
        HKQuantityTypeIdentifier.dietaryEnergyConsumed,
        'HKWorkoutTypeIdentifier',
      ],
    ).then(setHasPermissions);
  }, []);

  return hasPermissions ? (
    <DataView />
  ) : (
    <Text style={{ paddingTop: 40, textAlign: 'center' }}>Waiting for user to authorize..</Text>
  );
};

export default HealthKitTest;
