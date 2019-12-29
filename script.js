var vendors = ['webkit', 'moz'];
for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
    window.cancelAnimationFrame =
        window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
}

var //canvas = document.getElementById('canvas'),
    ticksPerSecond = 10,
    interval = 1000 / ticksPerSecond,
    lastTime = (new Date()).getTime(),
    currentTime = 0,
    delta = 0;

var testText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec at congue sem. Vestibulum nibh purus, pellentesque at mattis gravida, tempor sed velit. Pellentesque porta purus a urna sollicitudin, sit amet maximus diam accumsan. Vestibulum quam libero, feugiat ut facilisis vitae, pellentesque aliquam sem. Mauris et tortor non odio blandit volutpat. Nulla non ligula placerat elit congue varius. Proin leo nulla, consectetur non imperdiet vitae, tincidunt sed nibh. Vivamus ac mollis quam. Fusce auctor lectus libero, in accumsan sem lacinia et. Nunc posuere lacinia feugiat. Sed vulputate, purus volutpat fermentum euismod, sem mauris faucibus sem, eu maximus turpis ex nec ante. Duis cursus id sem non pretium. Nulla elit ante, posuere a massa eu, interdum condimentum est. Integer efficitur pulvinar lobortis. Morbi et tellus eget odio aliquet luctus ac in massa. Nam rhoncus nulla purus, ut dignissim ligula viverra et.",
    loading = false;

//==========Objects==========//

var player = {
    startTime: 0,
    fame: 0,
    generators: allGenerators,
    clickers: allClickers
};

//====================//

function startup() {
    loading = true;

    gotToStartScreen();

    if (localStorage.key('player') != undefined) {
        updateObjectsOnOldSave();
    }

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
        updateNumbers();
        updateGeneratorDisplay();
        saveGame();
        lastTime = currentTime - (delta % interval);
    }
}

function beginGame() {
    var savedFile = JSON.parse(localStorage.getItem('player'))

    if (savedFile != null) {
        player = savedFile;
    }

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

function updateNumbers() {

    for (var i in player.generators) {
        var generator = player.generators[i]

        if (generator.unlocked) {
            player.fame += calculateFame(player.generators[i])
        }

        if (generator.hasOwnProperty('special')) {
            generator.special();
        }
    }
}

function calculateFame(generator) {

    if (!generator.hasOwnProperty('generateFame')) {
        return generator.amount * generator.baseProduction;
    } else {
        return generator.generateFame();
    }
}

function createGeneratorElement(i) {
    //---Generates Generator Display elements---//

    var generator = player.generators[i],
        genAmount = generator.amount,
        genCost = generator.cost,
        genProduction = generator.baseProduction * ticksPerSecond,
        genName = generator.name;

    generator.id = camelize(genName);

    var genId = generator.id;

    var newGenElement = document.createElement('div'),
        amountDiv = document.createElement('div'),
        nameDiv = document.createElement('div'),
        productionDiv = document.createElement('div'),
        buyButtonsDiv = document.createElement('div'),
        buyOneDiv = document.createElement('div'),
        buyTenDiv = document.createElement('div'),
        buyMaxDiv = document.createElement('div'),
        buyCustomDiv = document.createElement('div'),
        unlockButtonDiv = document.createElement('div'),
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

    buyButtonsDiv.id = genId + 'BuyButtons';
    unlockButtonDiv.id = genId + 'UnlockButton';
    buyOneDiv.id = 'add1' + genId;
    buyTenDiv.id = 'add10' + genId;
    buyMaxDiv.id = 'addMax' + genId;
    buyCustomDiv.id = 'addX' + genId;
    maxCostDiv.id = 'maxCost' + genId;
    costForOneDiv.id = 'costForOne' + genId;
    productonOfOneDiv.id = 'productonOfOne' + genId;

    newGenElement.className = 'display generatorDisplay';
    buyButtonsDiv.className = 'buyButtonsContainer';
    unlockButtonDiv.className = 'button unlockButton'
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
    if (genCost != undefined) {
        summaryDiv.appendChild(costForOneDiv);
        buyButtonsDiv.appendChild(buyOneDiv);
        buyButtonsDiv.appendChild(buyTenDiv);
        buyButtonsDiv.appendChild(buyMaxDiv);
        //buyButtonsDiv.appendChild(buyCustomDiv);
    }
    summaryDiv.appendChild(productonOfOneDiv);
    summaryDiv.appendChild(unlockButtonDiv);



    infoButtonDiv.appendChild(infoTextDiv);

    $('#generatorPannel').append(newGenElement);
    $('#' + genId + 'Display').data(generator);
    $('#' + genId + 'Display').data('index', i);
    $('#' + genId + 'Name').text(genName);
    $('#' + genId + 'UnlockButton').text("-" + generator.unlockCost + " Fame to unlock " + genName);

    $('#add1' + genId).html("Buy 1<br>(-" + genCost + " fame)");
    $('#add1' + genId).val(1);
    $('#add10' + genId).html("Buy 10<br>(-" + genCost * 10 + " fame)");
    $('#add10' + genId).val(10);
    $('#addMax' + genId).html("Buy Max ");
    $('#addMax' + genId).append(maxCostDiv);
    $('#addMax' + genId).val(-1);

    $('#addX' + genId).text("Custom Amount");

    $('#infoButton' + genId).prepend('<i class="fas fa-info-circle"></i>');

    if (generator.info == undefined) {
        generator.info = testText;
    }

    $('#infoText' + genId).text(generator.info);

    if (player.generators[i].cost == undefined) {
        $('#' + genId + 'BuyButtonsContainer').css('display', 'none');
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
    $('#' + clickerId + 'Production').text(" (+" + clicker.baseProduction + "   fame)");
    $('#' + clickerId + 'Amount').text(clicker.amount + " Owned");

    $('#' + clickerId + 'Display').data(clicker);
    $('#' + clickerId + 'Display').data('index', i);

}

function updateGeneratorDisplay() {
    var famePerSecond = 0;

    //---Updates the Generator display--//
    for (var i in player.generators) {

        var generator = player.generators[i],
            genAmount = generator.amount,
            genId = generator.id,
            genProduction = calculateFame(generator),
            genCost = generator.cost;

        famePerSecond += genProduction;

        //--Updates Amount, Productiom, Cost for One etc. on Generaor Display
        $('#' + genId + 'Amount').text(parseNum(genAmount, true));
        $('#' + genId + 'Production').text(" (+" + parseNum(genProduction * ticksPerSecond, false) + " total fame/s)");
        $('#costForOne' + genId).text("Each costs " + parseNum(genCost, true) + " fame");
        $('#productonOfOne' + genId).text("Each produces " + parseNum(generator.baseProduction * ticksPerSecond, false) + " fame/s");

        if (Math.floor(player.fame / genCost) > 0) {
            $('#maxCost' + genId).text(" (+" + parseNum(player.fame / genCost, true) + " " + generator.name + ")");
        } else {
            $('#maxCost' + genId).text("");
        }

        //---Hids or Unhides Generator Display if the player owns or is able to purchas Generator---//
        var cssDisabledDisplay = {
                'opacity': '0.5',
                'filter': 'brightness(0.5)'
            },
            cssDisabledButton = {
                'opacity': '0.2',
            },
            cssEnabled = {
                'opacity': '1',
                'filter': 'brightness(1)'
            };


        if (((generator.hasOwnProperty('unlockCost') && player.fame * 1.5 >= generator.unlockCost) || genAmount > 0 || generator.unlocked)) {
            $('#' + genId + 'Display').css('display', 'flex');
        }

        if (genAmount > 0 || (player.fame >= generator.unlockCost)) {
            $('#' + genId + 'Display').css(cssEnabled);
        } else {
            $('#' + genId + 'Display').css(cssDisabledDisplay);
        }

        if (generator.unlocked) {
            $('#' + genId + 'BuyButtons').css('display', 'flex');
            $('#' + genId + 'UnlockButton').css('display', 'none');
        } else {
            $('#' + genId + 'BuyButtons').css('display', 'none');
            $('#' + genId + 'UnlockButton').css('display', 'flex');
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
    $('#fameDisplay').html('<div class=\'fameNum\'>' + parseNum(player.fame, false) + '</div> Fame');
    $('#FPSDisplay').text("+" + parseNum(famePerSecond * ticksPerSecond, false) + " fame/s");

}

function switchScreen() { //TODO make params optinal
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

    var log10 = Math.floor(Math.log10(num)),
        suffix = ["K", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No", "Dc"];

    if (num == undefined) {
        return '';

    } else if (log10 < 5 && wholeNumBool) {
        return num.toLocaleString(undefined, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });

    } else if (log10 < 5 && !wholeNumBool) {
        return num.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

    } else if (log10 - 5 > suffix.length) {
        return 1 + suffix[(suffix.length - 1)] + " > ";

    } else {
        if (wholeNumBool) {
            return (num / Math.pow(10, (log10 - 1))).toFixed(0) + suffix[log10 - 5];
        } else {
            return (num / Math.pow(10, (log10 - 1))).toFixed(2) + suffix[log10 - 5];
        }
    }
}

function clicker() {
    var i = $(this).parent().data().index,
        clicker = player.clickers[i],
        id = clicker.id + 'Button',
        pauseDelay = clicker.delay * 1000,
        amountAdded = clicker.amount * clicker.baseProduction;

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

function saveGame() {
    localStorage.setItem('player', JSON.stringify(player));
}

function resetGame() {
    localStorage.removeItem('player'),
        player = {
            startTime: 0,
            fame: 0,
            generators: allGenerators,
            clickers: allClickers
        };
}

function unlockGenerator() {
    var i = ($(this).parent().parent().data().index),
        generator = player.generators[i];
    if (player.fame >= generator.unlockCost) {
        generator.unlocked = true;
        generator.amount += 1;
        player.fame -= generator.unlockCost;
    }
}

function updateObjectsOnOldSave() {
    for (var i in allGenerators) {
        var playerGen = player.generators[i],
            newGen = allGenerators[i];

        if (playerGen.name !== newGen.name) {
            playerGen.name = newGen.name;
        }
        if (playerGen.cost !== newGen.cost) {
            playerGen.cost = newGen.cost;
        }
        if (playerGen.baseProduction !== newGen.baseProduction) {
            playerGen.baseProduction = newGen.baseProduction;
        }
        if (playerGen.unlockCost !== newGen.unlockCost) {
            playerGen.unlockCost = newGen.unlockCost;
        }
        if (playerGen.info !== newGen.info) {
            playerGen.info = newGen.info;
        }
        if (playerGen.special !== newGen.special) {
            playerGen.special = newGen.special;
        }
        if (playerGen.generateFame !== newGen.generateFame) {
            playerGen.generateFame = newGen.generateFame;
        }




    }
}

function startNewGame() {

    cancelResetButton();
    resetGame();
    console.log('Restarting Game');
    beginGame();
}

function gotToStartScreen() {

    $('#gameScreen').css('display', 'none');
    $('#startScreen').css('display', 'flex');

    if (localStorage.key('player') != undefined) {
        $('#resumeButton').css('display', 'flex');
    } else {
        $('#resumeButton').css('display', 'none');
    }


}

function createCustomGenerator() {
    var name = $('#customName').val(),
        cost = $('#customCost').val(),
        unlockCost = $('#customUnlockCost').val(),
        baseProduction = $('#customBaseProduction').val(),
        info = $('#customInfo').val();

    function isGenRepeat() {
        for (var i in player.generators) {
            if (player.generators[i].id.toLowerCase() == camelize(name).toLowerCase()) {
                console.log("No repeat Generators");
                return true;

            } else if (i == player.generators.length - 1) {
                return false;
            }
        }
    }

    $('#customName').removeClass('errorBorder');
    $('#customCost').removeClass('errorBorder');
    $('#customUnlockCost').removeClass('errorBorder');
    $('#customBaseProduction').removeClass('errorBorder');
    $('#errorDisplay').text('');

    if (isGenRepeat()) {
        $('#errorDisplay').text('No Repeat Generators');
        $('#customName').addClass('errorBorder');

    } else if (name != '' && cost != '' && unlockCost != '' && baseProduction != '') {

        console.log('All vals are full, creating Generator: ' + name);
        player.generators.push(new Generator(name, parseFloat(unlockCost), parseFloat(cost), parseFloat(baseProduction), info));

        $('#customName').val('').blur();
        $('#customCost').val('').blur();
        $('#customUnlockCost').val('').blur();
        $('#customBaseProduction').val('').blur();
        $('#customInfo').val('').blur();

        $('#generatorPannel').html('');
        $('#errorDisplay').text('');

        for (var i in player.generators) {
            createGeneratorElement(i);
        }
    } else {

        $('#errorDisplay').text('Missing required input(s)');

        if (name == '') {
            $('#customName').addClass('errorBorder');
        }
        if (cost == '') {
            $('#customCost').addClass('errorBorder');
        }
        if (unlockCost == '') {
            $('#customUnlockCost').addClass('errorBorder');
        }
        if (baseProduction == '') {
            $('#customBaseProduction').addClass('errorBorder');
        }
    }
}

function resetButton() {

    var savedFile = JSON.parse(localStorage.getItem('player'))

    if (savedFile != null) {
        $('#confirmResetPannel').css('display', 'flex');
    } else {
        beginGame();
    }
}

function cancelResetButton() {
    $('#confirmResetPannel').css('display', 'none');
}

$(document).ready(function () {

    startup();

    $('#resumeButton').click(beginGame);
    $('.tabOuter').click(switchScreen);
    $('.clickerButton').click(clicker);
    $('#createCustomGenerator').click(createCustomGenerator);

    $(document).on('click', '.infoButton', collapseText);
    $(document).on('click', '.unlockButton', unlockGenerator);
    $(document).on('click', '.buyButton', buy);

    $(document).on('click', '#restartButton', resetButton);
    $(document).on('click', '#confirmResetButton', startNewGame);
    $(document).on('click', '#cancelResetButton', cancelResetButton);

});

/*if (typeof (canvas.getContext) !== "undefined") {
    cx = canvas.getContext('2d');
    gameLoop();
}*/


// TODO Fix Aquaintance degredation to friends
// TODO Make a way to sort inventory
// TODO Encript and Unencript 
// TODO Add Random Event Features
// TODO Add Upgrade Features
// TODO Add Admin pannel
// TODO Add more generators
// TODO Balance generators
// TODO Write descrpitons for Generators
// TODO Build and write instreuctions, lore, explainations, and other story telling and user experinece elements
