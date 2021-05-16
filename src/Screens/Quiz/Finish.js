import React, {useState} from 'react';
import {View} from 'react-native';
import {makeStyles, Text} from 'react-native-elements';
import RecipeDetailModal from '../Recipes/RecipeDetailModal';
import LocalizationContext from '../../../LanguageContext';
import RecipeAnsweredCardItem from './RecipeAnsweredCardItem';

const Finish = props => {
  const {t} = React.useContext(LocalizationContext);
  const styles = useStyles();
  const {answeredQuestions} = props;
  const [open, setOpen] = useState(false);
  const [recipe, setRecipe] = useState(null);
  return (
    <View style={styles.container}>
      <RecipeDetailModal recipe={recipe} open={open} setOpen={setOpen} />

      <Text h2>{t('Quiz.done')}</Text>
      {answeredQuestions.map((item, i) => (
        <View key={i}>
          <RecipeAnsweredCardItem
            userAnswer={item.userAnswer}
            item={item.recipeDetails}
            setOpen={setOpen}
            setRecipe={setRecipe}
          />
        </View>
      ))}
    </View>
  );
};

export default Finish;

const useStyles = makeStyles(theme => ({}));
