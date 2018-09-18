
//Navigate to index.html with entered category
navigateToVisualization = (element) => {
  if(event.key === 'Enter') {
      const category = element.value;
      console.log('Value: ', category);
      location.href = './index?category=' + category; 
  }
}
