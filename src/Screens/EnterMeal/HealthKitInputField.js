import React from 'react';
import { makeStyles, useTheme } from 'react-native-elements';
import LocalizationContext from '../../../LanguageContext';
import { useUserSettings } from '../../hooks/useUserSettings';
import { HEALTHKIT } from '../Settings/glucoseSourceConstants';
import Healthkit, { HKQuantityTypeIdentifier } from '@kingstinct/react-native-healthkit';
import { HKUnit } from '@kingstinct/react-native-healthkit/src/index';
import { Alert, View } from 'react-native';
import OutLineButton from '../../Common/OutLineButton';

const HealthKitInputField = props => {
  const { t } = React.useContext(LocalizationContext);
  const styles = useStyles();
  const { theme } = useTheme();
  const { userSettings } = useUserSettings();

  function saveToHealthKit(g) {
    if (!isNaN(g)) {
      Healthkit.saveQuantitySample(
        HKQuantityTypeIdentifier.dietaryCarbohydrates,
        HKUnit.Grams,
        parseFloat(g),
        {
          start: props.date,
        }
      );
    }
  }

  const showAlert = () =>
    Alert.prompt(
      'Add Carbs to HealthKit',
      'Wenn du keine andere App nutzt um Kohlenhydrate in HealthKit zu speichern, tage hier die Anzahl an Kohlenhydrate für dein Gericht ein',
      [
        {
          text: 'Cancel',
          style: 'destructive',
        },
        {
          text: 'Save to HealthKit',
          style: 'default',
          onPress: g => saveToHealthKit(g),
        },
      ],
      'plain-text',
      '',
      'numeric',
    );

  return userSettings.glucoseSource === HEALTHKIT ? (
    <View style={styles.container}>
      <OutLineButton
        buttonStyle={{ paddingHorizontal: 20 }}
        title={'Kohlenhydrate in g'}
        onPress={showAlert}
      />
    </View>
  ) : null;
};

export default HealthKitInputField;

const useStyles = makeStyles(theme => ({
  container: {
    alignSelf: 'flex-start',
    marginLeft: theme.spacing.S,
    marginBottom: theme.spacing.S,
  },
}));
