
// Variables ******
var BrandSelector = document.querySelector('#brands')
var ModelSelector = document.querySelector('#models')
var CAR_BRAND = ''
var CAR_MODEL = ''
var msg = document.querySelector('#msg')



// Functions ******
// Function: GET brands data via API
function requestBrand() {
    var req = new XMLHttpRequest()
    req.open('GET', 'https://www.huk24.de/pkw24/api/5/comfortsearch/manufacturers', true)
    req.onload = function () {
        const BRAND_DATA = JSON.parse(this.response)
        if (req.status >= 200 && req.status < 400) {
            addBrandOptions(BRAND_DATA)
        } else {
            console.log('error')
        }
    }
    req.send()
}
// Function: GET Models data via API
function requestModels(CAR_BRAND) {
    // Define the prefix/suffix for easier maintain in the future
    var httpPrefix = 'https://www.huk24.de/pkw24/api/5/comfortsearch/models?manufacturer='
    var httpSuffix = '&begin=2021-04-23'
    var req = new XMLHttpRequest()
    req.open('GET', httpPrefix + CAR_BRAND + httpSuffix, true)
    req.onload = function () {
        const MODELS_DATA = JSON.parse(this.response)
        if (req.status >= 200 && req.status < 400) {
            addModelOptions(MODELS_DATA)
        } else {
            console.log('error')
        }
    }
    req.send()
}


// Function: Fill brands options from API
function addBrandOptions(data) {
    // Fill in the data
    for (i = 0; i < data.length; i++) {
        dom.create({
            content: data[i],
            attr: { 'value': data[i] },
            parent: BrandSelector
        })
    }
}

// Function: Fill Carodels options from API
function addModelOptions(data) {
    // Add the default status
    ModelSelector.innerHTML = '<option>bitte wählen Sie</option>'
    // Fill in the data
    for (i = 0; i < data.length; i++) {
        dom.create({
            content: data[i],
            attr: { 'value': data[i] },
            parent: ModelSelector
        })
    }
}


// Function: Show the slected result
function printMessage() {
    // Check whether Car Model is selected, showing this area only when CAR Model is selected
    CAR_MODEL == ('') ? msg.style.display = 'none' : msg.style.display = 'block'
    // Clear the previous result
    msg.innerHTML = ''
    // Fill in the content
    dom.create({
        tag: 'p',
        content: 'You selected the car:',
        parent: msg
    })
    dom.create({
        tag: 'p',
        content: CAR_BRAND + ' ' + CAR_MODEL,
        styles: { 'font-weight': 'bold' },
        parent: msg
    })
}

// Function: Create Dom Elements
const dom = {
    create({
        content = '',
        tag = 'option',
        parent = false,
        classes = [],
        attr = {},
        listeners = {
        },
        styles = {},
        amEnde = true,
    } = {}) {
        let newElement = document.createElement(tag)
        if (content) newElement.innerHTML = content
        if (classes.length) newElement.className = classes.join(' ')

        Object.entries(attr).forEach(el => newElement.setAttribute(...el))
        Object.entries(listeners).forEach(el => newElement.addEventListener(...el))
        Object.entries(styles).forEach(style => newElement.style[style[0]] = style[1])

        if (!amEnde && parent.children.length) parent.insertBefore(newElement, parent.children[0])
        else parent.append(newElement)

        return newElement
    }
}


// Eventlistener ******
// Eventlistener: Adjust Car brands options onchange
BrandSelector.onchange = function () {
    ModelSelector.removeAttribute('disabled')
    CAR_BRAND = BrandSelector.value
    CAR_MODEL = ''
    requestModels(CAR_BRAND)
    printMessage()
}

// Eventlistener: Adjust Car models options onchange
ModelSelector.onchange = function () {
    CAR_MODEL = ModelSelector.value
    printMessage()
}



// Starting status ******
function init() {
    requestBrand()
}

init()