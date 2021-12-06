const search = document.getElementById('search-bar');
const form = document.getElementById('input');
const results = document.getElementById('results');
const mealsCon = document.getElementById('meal-container');
const mealdesc = document.getElementById('meal-desc');



form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const temp = search.value;
    

    if(temp.trim()){
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${temp}`)
        .then(res => res.json())
        .then(data => {



            results.innerHTML = `<p>Search results for '${temp}':</p>`;
            if (data.meals === null) {
                results.innerHTML = `<p>No results.</p>`;
                mealsCon.innerHTML = '';
            }else {
                mealsCon.innerHTML = data.meals.map(
                    (meal) => `
                  <div class="meal" data-mealID="${meal.idMeal}">
                    <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                    <div class="meal-info" >
                      <p class="h4">${meal.strMeal}</p>
                    </div>
                  </div>
                `
                ).join("");
            }
        });

    }

});


function addMealToDOM(meal) {
    const ingredients = [];
    
    for (let i = 1; i <= 20; i++) {
      if (meal[`strIngredient${i}`]) {
        ingredients.push(
          `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
        );
      } else {
        break;
      }
    }
  
    mealdesc.innerHTML = `
      <div class="single-meal">
        <h3>${meal.strMeal}</h3>
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
        <div class="single-meal-info">
          ${meal.strCategory && `<p>Category: ${meal.strCategory}</p>`}
          ${meal.strArea && `<p>Region: ${meal.strArea}</p>`}
        </div>
        <div class="instruction">
          <p>${meal.strInstructions}</p>
          <h4>Ingredients</h4>
          <ul>
            ${ingredients.map((ing) => `<li>${ing}</li>`).join("")}
          </ul>
        </div>
        <div class="video">
            <iframe height ="380" width="500" src="${(meal.strYoutube).replace("watch?v=", "embed/")}" allowfullscreen></iframe>
        </div>
      </div>
    `;
  }

function getMealById(mealID) {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
      .then((res) => res.json())
      .then((data) => {

        const meal = data.meals[0];
  
        addMealToDOM(meal);
      });
}


mealsCon.addEventListener('click', (e)=>{
    const path = e.path || e.composedPath();
    const mealInfo = path.find((item) => {
        if (item.classList) {
            return item.classList.contains("meal");
        } else {
            return false;
    }
    });
    if (mealInfo) {
        const mealID = mealInfo.getAttribute("data-mealID");
        getMealById(mealID);
    }
});


