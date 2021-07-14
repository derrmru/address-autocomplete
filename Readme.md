# Google Maps Places AutoComplete

This is a reusable React component for quickly and easily adding an Address section to your forms. 

It uses Google Maps Places Autocomplete service to predict and autocomplete your input fields. 

This component offers a fast setup and inherits the styling of your app.

## Live Demo

![demo](https://raw.githubusercontent.com/derrmru/address-autocomplete/master/resources/example.gif)

Test the demo [here](https://thepetersweeney.com/autocomplete-address)

## Setup

1. Setup the APIS:

 - [Enable Google Maps Places API](https://developers.google.com/maps/documentation/javascript/places#enable_apis).
 - [Get an API key](https://developers.google.com/maps/documentation/javascript/get-api-key).

2. In your CLI and once navigated to your React JS project, install with the following command:

```javascript
npm i places-autocomplete-react
```

3. Implement in your app, as per the following example:

```javascript
import AutoComplete from 'places-autocomplete-react'

function App() {
  return (
      <AutoComplete 
        placesKey="AIzaSyAkuPHNHz8Ki1KV6n6iI1-EFVIC3ZAm0QY"
        inputId="address"
        setAddress={(addressObject) => console.log(addressObject)}
        />
  );
}

export default App;
```

The props are of the following types:

```
placesKey: string - this is your api key. The component will handle the rest.
inputId: string - using distinct id's will allow you to use multiple instances of this component in your form.
setAddress: function - the formatted address and input field state is made available to the parent component via this function. It's up to you what you do with it.

```

## Dependencies

None, just use it in your react project.

## That's it!