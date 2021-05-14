import React, {useEffect, useRef, useState} from 'react';
import {View} from 'react-native';
import {Button, Image, makeStyles, Text} from 'react-native-elements';
import {getRecipeDetails} from '../../Common/fatsecret/fatsecretApi';
import LocalizationContext from '../../../LanguageContext';
import {shuffle} from '../../utils/shuffel';

const fatSecretRecipes = [
  '8866808',
  '8307492',
  '5373738',
  '8953356',
  '11736480',
  '9216766',
  '8447633',
  '8289890',
  '8285578',
  '13291554',
  '12119207',
  '9661813',
  '8215434',
  '7536700',
];

const FatSecretQuiz = props => {
  const {t} = React.useContext(LocalizationContext);
  const styles = useStyles();
  const [recipeDetails, setRecipeDetails] = useState(null);
  const fsRecipeIds = useRef(shuffle(fatSecretRecipes));
  const [answers, setAnswers] = useState([]);
  const [validated, setValidated] = useState(false);
  const [current, setCurrent] = useState(0);
  function randomValues(value) {
    const threshold = value > 5 ? 3 : 0.4;
    let aboveThreshold = false;
    let rnd;

    do {
      rnd = (Math.random() * value + value / 2).toFixed(2);
      aboveThreshold = Math.abs(rnd - value) > threshold;
    } while (aboveThreshold === false);

    return rnd;
  }

  useEffect(() => {
    load();
  }, []);
  function validate(answer) {
    console.log(answer);
    setValidated(true);
    setTimeout(() => {
      setCurrent(prevState => prevState + 1);
      load();
    }, 1500);
  }

  function load() {
    if (fsRecipeIds.current !== null) {
      getRecipeDetails(fsRecipeIds.current[current]).then(recipe => {
        setRecipeDetails(recipe.recipe);
        console.log(recipe);
        console.log(current);

        const array = [
          {id: 1, value: randomValues(recipe.recipe.serving_sizes.serving.carbohydrate), right: false},
          {id: 2, value: recipe.recipe.serving_sizes.serving.carbohydrate, right: true},
          {id: 3, value: randomValues(recipe.recipe.serving_sizes.serving.carbohydrate), right: false},
          {id: 4, value: randomValues(recipe.recipe.serving_sizes.serving.carbohydrate), right: false},
        ];
        setAnswers(prev => shuffle(array));
        setValidated(false);
      });
    }
  }

  function color(answer) {
    return validated
      ? answer
        ? {backgroundColor: 'green'}
        : {backgroundColor: 'red'}
      : {backgroundColor: 'yellow'};
  }

  return recipeDetails !== null ? (
    <View>
      <Image
        style={styles.image}
        source={{
          uri: Array.isArray(recipeDetails.recipe_images.recipe_image)
            ? recipeDetails.recipe_images.recipe_image[0]
            : recipeDetails.recipe_images.recipe_image,
        }}
      />
      <Text h2>
        <Text h2>{recipeDetails.serving_sizes.serving.serving_size}</Text> {recipeDetails.recipe_name}
      </Text>
      {recipeDetails.serving_sizes && (
        <View style={styles.desc}>
          {answers &&
            answers.map((answer, i) => (
              <Button
                buttonStyle={color(answer.right)}
                key={i}
                style={styles.answerButton}
                onPress={() => validate(answer.right)}
                title={answer.value + 'g'}
              />
            ))}
        </View>
      )}
      <Text h2>{t('Recipes.ingredients')}</Text>
      <Text>Portionen: {recipeDetails.number_of_servings}</Text>

      {recipeDetails.ingredients &&
        recipeDetails.ingredients.ingredient.map((ingre, i) => (
          <View style={styles.desc} key={i}>
            <Text>{ingre.food_name}</Text>
            <Text>
              {ingre.number_of_units} {ingre.measurement_description}
            </Text>
          </View>
        ))}
      <Text h2>{t('Recipes.directions')}</Text>

      {recipeDetails.directions && Array.isArray(recipeDetails.directions.direction)
        ? recipeDetails.directions.direction.map((desc, i) => (
            <View style={styles.desc} key={i}>
              <Text>{desc.direction_description}</Text>
            </View>
          ))
        : null}
    </View>
  ) : null;
};

export default FatSecretQuiz;

const useStyles = makeStyles(theme => ({
  root: {minHeight: 700},
  image: {width: '100%', height: 250, borderRadius: 10, marginBottom: theme.spacing.L},
  desc: {paddingVertical: theme.spacing.S},
  answerButton: {padding: theme.spacing.S},
}));
