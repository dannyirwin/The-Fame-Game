class Generator {
    constructor(name, unlockCost, cost, baseProduction, infoText) {
        this.name = name;
        this.amount = 0;
        this.cost = cost;
        this.baseProduction = baseProduction;
        this.unlockCost = unlockCost;
        this.unlocked = false;
        this.info=infoText;

    }
}

class Clicker {
    constructor(name, amount, cost, production, delay, text) {
        this.name = name;
        this.amount = amount;
        this.cost = cost;
        this.baseProduction = production;
        this.delay = delay;
        this.text = text;
        this.id = camelize(name);
        this.paused = false;
    }
}

var allGenerators = [
        {
            name: "Parent or Guardian",
            amount: 1,
            cost: undefined,
            baseProduction: 0.1,
            unlocked: true,
            info: "Your Parent or Guardian loves you very much. They are your first real fan and have given you the confidence to put yourself out there.  You may or may not have one or more additional Parents or Guardians, but they don't quite \"Get\" your whole deal. You can't really use your fame and influence to get any more of these."
    },

        {
            name: "Friends",
            amount: 0,
            cost: 25,
            baseProduction: 0.02,
            unlocked: false,
            unlockCost: 25,
            info: "These are some of the closest people to you. They support you and love you, warts and all. But it can be hard maintaining too many friendships.  Most people can only support a maximum of 10 close friends at once. Once you have more than 10 friends at a time, the quality of your additional friedships will diminsh. Every once and a while, though, they'll introduce you to their friends, which can be useful for networking. Or even just a little name recognistion.",
            special: function special() {

                //--Random chance to add Friends of Friends--//
                var randMax = 1000,
                    generatorToCreate = "Friend of Friends",
                    targetIndex = 2;

                if (player.generators[targetIndex].name !== generatorToCreate) {
                    for (var i in player.generators) {
                        if (player.generators[i].name == generatorToCreate) {
                            targetIndex = generatorToCreate;
                        }
                    }
                }

                
                if (Math.floor(Math.random() * randMax) + 1 <= this.amount) {
                    console.log("A Friend told one of thier Friends about you!");
                    player.generators[targetIndex].unlocked = true;

                    player.generators[targetIndex].amount += 1;
                }


            },
            generateFame: function () {
                var maxFriends = 10;
                if (this.amount > maxFriends) {
                    return (maxFriends * this.baseProduction) + (Math.log(this.amount - maxFriends) * this.baseProduction);
                } else {
                    return this.amount * this.baseProduction;
                }
            }

    },
        {
            name: "Friend of Friends",
            amount: 0,
            baseProduction: 0.005,
            unlocked: false,
            info: "You cant buy these folks outright, they are passively created by your friends. The more friends you have, the more likey they'll generate a new Friend of a Friend.",
            special: function () {
                var targetIndex = 1,
                    targetGenerator = "Friends"
                if (player.generators[targetIndex].name !== targetGenerator) {
                    for (var i in player.generators) {
                        if (player.generators[i].name == targetGenerator) {
                            targetIndex = targetGenerator;
                        }
                    }
                }
                if (player.generators[targetIndex].unlocked && this.amount > 0) {
                    this.unlocked = true;
                }
            }
    },
        {
            name: "Aquaintances",
            amount: 0,
            cost: 15,
            baseProduction: 0.001,
            unlocked: false,
            unlockCost: 50,
            info: "Aquaintances are just friends you haven't gotten that close to yet.  There is a random chance that an Aquaintance will become a Friend!",
            special: function () {
                var randMax = 50000,
                    generatorToCreate = "Friends";
                if (this.amount > 0) {
                    if (Math.floor(Math.random() * randMax) + 1 <= this.amount)
                        for (var i in player.generators)
                            if (player.generators[i].name == generatorToCreate && player.generators[i].unlocked) {
                                console.log("One " + this.name + " converted to one " + generatorToCreate);
                                player.generators[i].amount += 1;
                                this.amount -= 1;
                            }

                }
            }
    },
        {
            name: "Followers",
            amount: 0,
            cost: 40,
            baseProduction: 0.001,
            unlocked: false,
            unlockCost: 100,
            info: "Followrs are fickle creatures. Some of the really love you, while others have a passing interest.  Each new follower will generate a random amount of fame within a range.  For projection purposes, the average possible production is displayed",
            generateFame: function() {
                var maxPossibleGenerated = 0.05,
                    amountGenerated = Math.random() * maxPossibleGenerated;

                if (this.productionArr.length < this.amount) {
                    for (var i = 0; i <= this.amount - this.productionArr.length; i++) {
                        this.productionArr.push(amountGenerated);
                    }
                }

                return this.productionArr.reduce((a, b) => a + b, 0);

            },
            productionArr: []
    },
        {
            name: "Admirer",
            amount: 0,
            cost: 1000,
            baseProduction: 0.1,
            unlocked: false,
            unlockCost: 1000

    },
        {
            name: "Stalker",
            amount: 0,
            cost: 2000,
            baseProduction: 1,
            unlocked: false,
            unlockCost: 2000

    }
    ]

    /*
    new Generator("Stalker", 0, 2000, 1),
    new Generator("Super Fan", 0, 5000, 1),
    new Generator("Something1", 0, 5000, 1),
    new Generator("omething2", 0, 5000, 1),
    new Generator("Something3", 0, 5000, 1)
    */
    ,

    allClickers = [
        new Clicker("Social Network", 1, 10, 1, 1, "Make Post"),
        new Clicker("Email Blast", 1, 10, 2, 5, "Send Blast"),
      new Clicker("Clicker 1", 1, 10, 12, 4, "Do It"),
      new Clicker("Clicker 2", 1, 10, 100, 50, "Do It"),
      new Clicker("Clicker 3", 1, 10, 5, 10, "Do It"),
      new Clicker("Clicker 4", 1, 10, 2, 0.1, "Do It")

    ];



function createGeneraotr(name, amount, cost, baseProduction, info) {

}





function camelize(str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
        return index == 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, '');
}
