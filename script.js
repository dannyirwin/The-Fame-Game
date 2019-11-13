var vendors = ['webkit', 'moz'];
for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
    window.cancelAnimationFrame =
        window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
}

var //canvas = document.getElementById('canvas'),
    fps = 10,
    interval = 1000 / fps,
    lastTime = (new Date()).getTime(),
    currentTime = 0,
    delta = 0;

var testText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec at congue sem. Vestibulum nibh purus, pellentesque at mattis gravida, tempor sed velit. Pellentesque porta purus a urna sollicitudin, sit amet maximus diam accumsan. Vestibulum quam libero, feugiat ut facilisis vitae, pellentesque aliquam sem. Mauris et tortor non odio blandit volutpat. Nulla non ligula placerat elit congue varius. Proin leo nulla, consectetur non imperdiet vitae, tincidunt sed nibh. Vivamus ac mollis quam. Fusce auctor lectus libero, in accumsan sem lacinia et. Nunc posuere lacinia feugiat. Sed vulputate, purus volutpat fermentum euismod, sem mauris faucibus sem, eu maximus turpis ex nec ante. Duis cursus id sem non pretium. Nulla elit ante, posuere a massa eu, interdum condimentum est. Integer efficitur pulvinar lobortis. Morbi et tellus eget odio aliquet luctus ac in massa. Nam rhoncus nulla purus, ut dignissim ligula viverra et.";

//==========Objects==========//

class Generator {
    constructor(name, amount, cost, production, description) {
        this.name = name;
        this.amount = amount;
        this.cost = cost;
        this.fameProduction = production;
        this.id = camelize(name);
    }
}

class Clicker {
    constructor(name, amount, cost, production, delay, text) {
        this.name = name;
        this.amount = amount;
        this.cost = cost;
        this.fameProduction = production;
        this.delay = delay;
        this.text = text;
        this.id = camelize(name);
        this.paused = false;
    }
}

var player = {
    startTime: 0,
    fame: 0,
    generators: [ // Name - Amount Owned - Cost - Production per tic (0.1 seconds) //
        new Generator("Parent or Guardian", 1, undefined, 0.05),
        new Generator("Friends", 0, 25, 0.01),
        new Generator("Friends of Friends", 0, 10, 0.001),
        new Generator("Acquaintances", 0, 10, 0.001),
        new Generator("Admirer", 0, 1000, 1),
        new Generator("Stalker", 0, 2000, 1),
        new Generator("Super Fan", 0, 5000, 1),
        new Generator("Something1", 0, 5000, 1),
        new Generator("omething2", 0, 5000, 1),
        new Generator("Something3", 0, 5000, 1)
    ],
    clickers: [
        new Clicker("Social Network", 1, 10, 1, 1, "Make Post"),
        new Clicker("Email Blast", 1, 10, 2, 5, "Send Blast"),
      new Clicker("Clicker 1", 1, 10, 12, 4, "Do It"),
      new Clicker("Clicker 2", 1, 10, 100, 50, "Do It"),
      new Clicker("Clicker 3", 1, 10, 5, 10, "Do It"),
      new Clicker("Clicker 4", 1, 10, 2, 0.1, "Do It")
    ]
}


//====================//

function startup() {

    for (var i in player.generators) {
        createGeneratorElement(i);
    }

    for (var i in player.clickers) {
        createClickerElement(i);
    }
}

function gameLoop() {
    window.requestAnimationFrame(gameLoop);
    currentTime = (new Date()).getTime();
    delta = (currentTime - lastTime);

    if (delta > interval) {
        generateFame();
        updateGeneratorData();
        lastTime = currentTime - (delta % interval);
    }
}

function beginGame() {

    player.startTime = new Date();

    $('#StartTimeDisplay').text("Game started on: " + player.startTime);
    $('#startScreen').css('display', 'none');
    $('#gameScreen').css('display', 'flex');

    console.log("Game Started");
    gameLoop();
}

function buy() {
    var i = ($(this).parent().parent().data().index),
        generator = player.generators[i],
        val = parseInt($(this).val()),
        cost = generator.cost,
        amountToBuy;

    if (val == -1) {
        amountToBuy = Math.floor(player.fame / cost);
        cost = generator.cost * amountToBuy;
        player.fame -= cost;
        generator.amount += amountToBuy;
        console.log("Bought " + amountToBuy + " " + player.generators[i].name)
    } else if (player.fame >= player.generators[i].cost * val) {
        amountToBuy = val;
        cost = generator.cost * amountToBuy;
        player.fame -= cost;
        generator.amount += amountToBuy;
        console.log("Bought " + amountToBuy + " " + player.generators[i].name);

        ;
    } else {
        console.log(val, "Not enough fame to buy.");
    }
}

function generateFame() {
    for (var i in player.generators) {
        player.fame += player.generators[i].fameProduction * player.generators[i].amount;
    }
}

function camelize(str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
        return index == 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, '');
}

function createGeneratorElement(i) {
    //---Generates Generator Display elements---//

    var generator = player.generators[i],
        genId = generator.id,
        genAmount = generator.amount,
        genCost = generator.cost,
        genProduction = generator.fameProduction * 10,
        genName = generator.name;

    var newGenElement = document.createElement('div'),
        amountDiv = document.createElement('div'),
        nameDiv = document.createElement('div'),
        productionDiv = document.createElement('div'),
        buyButtonsDiv = document.createElement('div'),
        buyOneDiv = document.createElement('div'),
        buyTenDiv = document.createElement('div'),
        buyMaxDiv = document.createElement('div'),
        buyCustomDiv = document.createElement('div'),
        breakDiv = document.createElement('div'),
        maxCostDiv = document.createElement('div'),
        costForOneDiv = document.createElement('div'),
        productonOfOneDiv = document.createElement('div'),
        summaryDiv = document.createElement('div'),
        infoButtonDiv = document.createElement('div'),
        infoTextDiv = document.createElement('div');

    newGenElement.id = genId + 'Display';

    summaryDiv.id = genId + 'Summary';
    amountDiv.id = genId + 'Amount';
    nameDiv.id = genId + 'Name';
    productionDiv.id = genId + 'Production';
    costForOneDiv.id = 'costForOne' + genId;
    productonOfOneDiv.id = 'productonOfOne' + genId;
    infoButtonDiv.id = 'infoButton' + genId;
    infoTextDiv.id = 'infoText' + genId;

    buyButtonsDiv.id = genId + 'BuyButtonsId';
    buyOneDiv.id = 'add1' + genId;
    buyTenDiv.id = 'add10' + genId;
    buyMaxDiv.id = 'addMax' + genId;
    buyCustomDiv.id = 'addX' + genId;
    maxCostDiv.id = 'maxCost' + genId;
    costForOneDiv.id = 'costForOne' + genId;
    productonOfOneDiv.id = 'productonOfOne' + genId;

    newGenElement.className = 'display generatorDisplay';
    buyButtonsDiv.className = 'buyButtonsContainer';
    buyOneDiv.className = 'button buyButton';
    buyTenDiv.className = 'button buyButton';
    buyMaxDiv.className = 'button buyButton buyCustom';
    buyCustomDiv.className = 'button buyButton buyCustom';
    amountDiv.className = 'amount';
    nameDiv.className = 'name';
    summaryDiv.className = 'summary';
    infoButtonDiv.className = 'infoButton';
    infoTextDiv.className = 'infoText';

    newGenElement.appendChild(summaryDiv);
    newGenElement.appendChild(buyButtonsDiv);
    newGenElement.appendChild(infoButtonDiv);

    summaryDiv.appendChild(amountDiv);
    summaryDiv.appendChild(nameDiv);
    summaryDiv.appendChild(productionDiv);
    if (genCost !== undefined) {
        summaryDiv.appendChild(costForOneDiv);
    }
    summaryDiv.appendChild(productonOfOneDiv);

    buyButtonsDiv.appendChild(buyOneDiv);
    buyButtonsDiv.appendChild(buyTenDiv);
    buyButtonsDiv.appendChild(buyMaxDiv);
    buyButtonsDiv.appendChild(buyCustomDiv);

    infoButtonDiv.appendChild(infoTextDiv);

    $('#generatorPannel').append(newGenElement);
    $('#' + genId + 'Display').data(generator);
    $('#' + genId + 'Display').data('index', i);
    $('#' + genId + 'Name').text(genName);

    $('#add1' + genId).html("+1<br>(-" + genCost + " fame)");
    $('#add1' + genId).val(1);
    $('#add10' + genId).html("+10<br>(-" + genCost * 10 + " fame)");
    $('#add10' + genId).val(10);
    $('#addMax' + genId).html("+Max ");
    $('#addMax' + genId).append(maxCostDiv);
    $('#addMax' + genId).val(-1);

    $('#addX' + genId).text("Custom");

    $('#infoButton' + genId).prepend('<i class="fas fa-info-circle"></i>');

    $('#infoText' + genId).text(testText);

    if (player.generators[i].cost == undefined) {
        $('#' + genId + 'BuyButtonsId').css('display', 'none');
    }

}

function createClickerElement(i) {
    var clicker = player.clickers[i],
        clickerId = clicker.id,
        clickerName = clicker.name;

    var newClickerElement = document.createElement('div'),
        nameDiv = document.createElement('div'),
        clickerButtonDiv = document.createElement('div'),
        buttonTextDiv = document.createElement('div'),
        productionDiv = document.createElement('div'),
        amountDiv = document.createElement('div'),
        summaryDiv = document.createElement('div');

    newClickerElement.id = clickerId + 'Display';
    nameDiv.id = clickerId + 'Name';
    clickerButtonDiv.id = clickerId + 'Button';
    buttonTextDiv.id = clickerId + 'Text';
    productionDiv.id = clickerId + 'Production';
    amountDiv.id = clickerId + 'Amount';

    newClickerElement.className = 'clickerDisplay';
    clickerButtonDiv.className = 'clickerButton';
    productionDiv.className = 'clickerProduction';
    amountDiv.className = 'clickerAmount';
    summaryDiv.className = 'clickerSummary';

    newClickerElement.appendChild(summaryDiv);
    newClickerElement.appendChild(clickerButtonDiv);

    summaryDiv.appendChild(nameDiv);
    summaryDiv.appendChild(amountDiv);

    clickerButtonDiv.appendChild(buttonTextDiv);
    clickerButtonDiv.appendChild(productionDiv);




    $('#clickerPannel').append(newClickerElement);
    $('#' + clickerId + 'Name').text(clickerName);
    $('#' + clickerId + 'Text').text(clicker.text)
    $('#' + clickerId + 'Production').text(" (+" + clicker.fameProduction + "   fame)");
    $('#' + clickerId + 'Amount').text(clicker.amount + " Owned");

    $('#' + clickerId + 'Display').data(clicker);
    $('#' + clickerId + 'Display').data('index', i);

}

function updateGeneratorData() {
    var famePerSecond = 0;

    //---Updates the Generator display--//
    for (var i in player.generators) {

        var generator = player.generators[i],
            genAmount = generator.amount,
            genId = generator.id,
            genProduction = generator.fameProduction * genAmount * 10,
            genCost = generator.cost;

        famePerSecond += genProduction;



        $('#' + genId + 'Amount').text(parseNum(genAmount, false));
        $('#' + genId + 'Production').text(" (+" + parseNum(genProduction, false) + " total fame/s)");
        $('#costForOne' + genId).text("Each costs " + parseNum(genCost, false) + " fame");
        $('#productonOfOne' + genId).text("Each produces " + parseNum(generator.fameProduction * 10, false) + " fame/s");

        if (Math.floor(player.fame / genCost) > 0) {
            $('#maxCost' + genId).text(" (+" + parseNum(player.fame / genCost, true) + " " + generator.name + ")");
        } else {
            $('#maxCost' + genId).text("");
        }

        //---Hids or Unhides Generator Display if the player owns or is able to purchas Generator---//
        var cssDisabledDisplay = {
                'opacity': '0.5',
                'pointer-events': 'none',
                'filter': 'brightness(0.5)'
            },
            cssDisabledButton = {
                'opacity': '0.2',
                'pointer-events': 'none'
            },
            cssEnabled = {
                'opacity': '1',
                'pointer-events': 'all',
                'filter': 'brightness(1)'
            };

        if (player.fame * 2 >= genCost || genAmount > 0) {
            $('#' + genId + 'Display').css('display', 'flex');
        } else {
            $('#' + genId + 'Display').css('display', 'none');
        }

        if (genAmount > 0 || (player.fame >= genCost)) {
            $('#' + genId + 'Display').css(cssEnabled);
        } else {
            $('#' + genId + 'Display').css(cssDisabledDisplay);
        }

        //---Disables/Enables Buy buttons if not enought Fame---//


        if (player.fame < generator.cost) {
            $('#add1' + genId).css(cssDisabledButton);
            $('#addMax' + genId).css(cssDisabledButton);
            $('#addX' + genId).css(cssDisabledButton);
        } else {
            $('#add1' + genId).css(cssEnabled);
            $('#addMax' + genId).css(cssEnabled);
            $('#addX' + genId).css(cssEnabled);
        }
        if (player.fame < generator.cost * 10) {
            $('#add10' + genId).css(cssDisabledButton);
        } else {
            $('#add10' + genId).css(cssEnabled);
        }

    }

    //---Updates Fame display---//
    $('#fameDisplay').text(parseNum(player.fame));
    $('#FPSDisplay').text("+" + parseNum(famePerSecond) + " fame/s");

}

function switchScreen() {
    var id = this.id,
        cssChange = 'translate(0, vh)';

    if (id !== 'fameTab') {
        $('.gamePannel').css('display', 'none');
        $('.tabOuter').removeClass('tabSelected');

        if (id == 'generatorTab') {
            $('#generatorPannel').css('display', 'flex');
            $('#generatorTab').addClass('tabSelected');
        } else if (id == 'clickerTab') {
            $('#clickerPannel').css('display', 'flex');
            $('#clickerTab').addClass('tabSelected');
        } else if (id == 'upgradeTab') {
            $('#upgradePannel').css('display', 'flex');
            $('#upgradeTab').addClass('tabSelected');
        } else if (id == 'infoTab') {
            $('#infoPannel').css('display', 'flex');
            $('#infoTab').addClass('tabSelected');
        }

        console.log("Goint to " + id + " associated Pannel.")
    }


}

function collapseText() {
    var id = $(this).parent().data().id,
        displayVal = $('#infoText' + id).css('display');

    if (displayVal == 'none') {
        $('.infoText').css('display', 'none');
        $('#infoText' + id).css('display', 'flex');
        console.log(id);
    } else {
        $('.infoText').css('display', 'none');
    }
}

function parseNum(num, wholeNumBool) {

    if (wholeNumBool) {
        num = Math.floor(num) * 100;
    } else {
        num = Math.floor(num * 100);
    }

    //TODO Look at this again to see if there is a better option that having super long 999999 numbers.
    //TODO [x]make so there is an option that doesn't have decemal places included for small numbers.

    if (num < 99999.99 * 100) {
        return Number(num / 100).toLocaleString();
    } else if (num < 999999.99 * 100) {
        return Math.floor(num / 1000) / 100 + 'K';
    } else if (num < 999999999.99 * 100) {
        return Math.floor(num / 1000000) / 100 + 'M';
    } else if (num < 999999999999.99 * 100) {
        return Math.floor(num / 1000000000) / 100 + 'B';
    } else if (num < 999999999999999.99 * 100) {
        return Math.floor(num / 1000000000000) / 100 + 'T';
    } else if (num < 999999999999999999.99 * 100) {
        return Math.floor(num / 1000000000000000) / 100 + 'Qa';
    } else if (num < 999999999999999999999.99 * 100) {
        return Math.floor(num / 1000000000000000000) / 100 + 'Qi';
    } else if (num < 999999999999999999999999.99 * 100) {
        return Math.floor(num / 1000000000000000000000) / 100 + 'Sx';
    } else if (num < 999999999999999999999999999.99 * 100) {
        return Math.floor(num / 1000000000000000000000000) / 100 + 'Sp';
    } else if (num < 999999999999999999999999999999.99 * 100) {
        return Math.floor(num / 1000000000000000000000000000) / 100 + 'Oc';
    } else if (num < 999999999999999999999999999999999.99 * 100) {
        return Math.floor(num / 1000000000000000000000000000000) / 100 + 'No';
    } else if (num < 999999999999999999999999999999999999.99 * 100) {
        return Math.floor(num / 1000000000000000000000000000000000) / 100 + 'Dc';
    } else {
        return Number(Math.floor(num / 100)).toLocaleString();
    }
}

function clicker() {
    var i = $(this).parent().data().index,
        clicker = player.clickers[i],
        id = clicker.id + 'Button',
        pauseDelay = clicker.delay * 1000,
        amountAdded = clicker.amount * clicker.fameProduction;

    if (!clicker.paused) {
        clicker.paused = true;
        $(this).addClass('clickerButtonPaused');
        $(this).css('animation-duration', clicker.delay + 's');
        player.fame += amountAdded;
        console.log("Paused");
        setTimeout(function () {
            $('#' + id).removeClass('clickerButtonPaused');
            clicker.paused = false;
            console.log("Un-paused")
        }, pauseDelay);
    } else {
        console.log("Cant get Fame. Still paused.");
    }


    console.log(clicker.name + "s added " + amountAdded);
}

$(document).ready(function () {
    startup();

    $('#startButton').click(beginGame);
    $('.buyButton').click(buy);
    $('.tabOuter    ').click(switchScreen);
    $('.clickerButton').click(clicker);
    $('.infoButton').click(collapseText);

});

/*if (typeof (canvas.getContext) !== "undefined") {
    cx = canvas.getContext('2d');
    gameLoop();
}*/

// TODO Add Random Event Features
// TODO Add Upcrade Features
// TODO Add Admin pannel with
// TODO Figure out how to save a file and re-load it
// TODO Add more generators
// TODO Balance generators
// TODO Write descrpitons for Generators
// TODO Build and write instreuctions, lore, explainations, and other story telling and user experinece elements
