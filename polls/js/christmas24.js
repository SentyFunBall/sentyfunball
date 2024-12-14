let server = "https://christmas24-443818.uk.r.appspot.com"
let selectedName = "";


//Fetches names from backend
async function nameFetch() {
    let names = [];

    try {
        let response = await fetch(server+"/api/getNameFetch");
        if (response.status == 200) {
            response = await response.json();
            response = response["Body"];
    
            //json to array
            for (var i in response)
                names.push(response[i]);
    
            names.sort();
    
            console.log("Fetched names");
            return names;
        }
    } catch (err) {
        console.log(err);
    }
    return "Not found"
}

//Grabs userdata from backend
async function getData(name) {
    console.log("Fetching data: ",name);
    const queryString = new URLSearchParams({name:name}).toString();
    let response = await fetch(server+"/api/getUserResponse?"+queryString);
    if (response.status == 200) {
        response = await response.json();
        response = response["Body"];
        return response;
    } else if (response.status == 429) {
        return "Too many requests"
    }
    return "Not found";
}

//on load
document.addEventListener("DOMContentLoaded", async() => {
    console.log("Creating event listeners");
    const searchBox = document.getElementById("searchbox");
    const nameList = document.getElementById("namelist");
    const submitBtn = document.getElementById("submitbutton");

    let names = await nameFetch();
    if(names == "Not found") {
        console.log("Couldn't fetch names");
        showError("Failed to connect to server.");
    }
    let alreadySubmit = false;
    let userData = {};

    let resultBoxes = [];
    for (let i = 0; i <= 15; i++) {
        let box = document.getElementById("result"+i);
        resultBoxes.push([box, box.innerHTML]);
        box.innerHTML = "";
    }

    //whenever the box is clicked on, show name list
    searchBox.addEventListener("focus", () => {
        const query = searchBox.value.toLowerCase();
        filterNames(query);
        nameList.style.display = "block";
    });

    //filter down as input is typed
    searchBox.addEventListener("input", () => {
        const query = searchBox.value.toLowerCase();
        selectedName = query;
        filterNames(query);
        nameList.style.display = "block";
    });

    //hide list on lost focus
    document.addEventListener("click", (e) => {
        if(!e.target.closest("#namelist") && e.target !== searchBox) {
            nameList.style.display = "none"
        }
    });

    //when user clicks name in dropdown, autofill
    nameList.addEventListener("click", (e) => {
        if(e.target.tagName === "DIV") {
            selectedName = e.target.innerHTML;
            searchBox.value = selectedName;
            nameList.style.display = "none";
        }
    });

    //submit
    submitBtn.addEventListener("click", async () => {
        if(selectedName && !alreadySubmit) {
            if (selectedName.length > 128) {
                selectedName.substring(0, 128);
            }
            userData = await getData(selectedName);
            if (userData == "Not found") {
                showError("User not found.");
            } else if (userData == "Too many requests") {
                showError("Too many requests");
            } else {
                alreadySubmit = true;
                updateResults(userData);
            }
        } else {
            showError("Already submitted a name!");
        }
    });

    //filter names based on query
    function filterNames(query) {
        nameList.innerHTML = "";
        names
            .filter((name) => name.toLowerCase().includes(query))
            .forEach((name) => {
                const div = document.createElement("div");
                div.innerHTML = name;
                nameList.appendChild(div);
            });
    }

    //update shit
    async function updateResults(userData) {
        if(userData) {
            console.log("Updating page with user data");
            const response = await fetch("../js/random.json");
            const randoms = await response.json();
            const questions = userData.questions
            
            for (let i = 0; i < resultBoxes.length; i++) {
                let box = resultBoxes[i];
                let box2
                
                //difference response additions
                switch (box[0].classList[0]) {
                    case "type0":
                        box[0].innerHTML = questions[box[1]]=="Nice" ? "Nice, congratulations." : "Naughty, how unfortunate.";
                        
                        box2 = document.getElementById("result"+i+"type0");
                        box2.innerHTML = randoms[box[1]][getRandomInt(4)] + ` You were ${questions[box[1]]}. You might be part of the special group. <b>~69% were nice</b>. Nice. I'm not kidding.`;
                        break;
                    case "type1":
                        box[0].innerHTML = questions[box[1]]=="I am a very good Stormworker" ? "a good Stormworker this year. That's not right." : "a bad Stormworker this year. Good job.";
                        
                        box2 = document.getElementById("result"+i+"type1");
                        box2.innerHTML = randoms[box[1]][getRandomInt(4)] + " And guess what? Some people <i>somehow</i> agree with you! <b>46% lied</b> and said they're good! Good at the game or good morally? Who knows. Not me.";
                        break;
                    case "type2":
                        box[0].innerHTML = questions[box[1]]=="Yes" ? "in it" : "not";
                        break;
                    case "type3":
                        box[0].innerHTML = questions[box[1]]=="Yes" ? " XML edit. I'm proud." : "not XML edit. I'm not mad, just disappointed.";

                        box2 = document.getElementById("result"+i+"type3");
                        box2.innerHTML = "<b>66%</b> of <s>Americans</s> Stormworkers XML edit. Here's an AI generated poem about XML editing: <i>" + randoms[box[1]][getRandomInt(4)] + "</i> That was worse than I thought."
                        break;
                    case "type4":
                        box[0].innerHTML= questions[box[1]]
                        break;
                    case "type5":
                        box[0].innerHTML = questions[box[1]]=="Yes" ? "" : "not";

                        box2 = document.getElementById("result"+i+"type5");
                        box2.innerHTML =  randoms[box[1]][getRandomInt(4)]
                        break;
                    case "type6":
                        box[0].innerHTML = questions[box[1]]=="Yes" ? "" : " not";
                        break;
                    case "type7":
                        box[0].innerHTML= questions[box[1]];

                        box2 = document.getElementById("result"+i+"type7");
                        box2.innerHTML =  randoms[box[1]][getRandomInt(4)];
                        break;
                    case "type8":
                        box[0].innerHTML= questions[box[1]];

                        box2 = document.getElementById("result"+i+"type8");
                        box2.innerHTML =  randoms[box[1]][getRandomInt(4)];
                        break;
                    case "type9":
                        box[0].innerHTML = questions[box[1]]=="Yes" ? "indeed" : "not";
                        break;
                    case "type10":
                        box[0].innerHTML = randoms[box[1]][getRandomInt(4)];

                        box2 = document.getElementById("result"+i+"type10");
                        if (questions[box[1]]=="Yes") {
                            box2.innerHTML = `You said you do, in fact, use ChatGPT to code. How's that working out for you? Not well? Shame, isn't it.`
                        } else {
                            box2.innerHTML = `You said you don't use ChatGPT to code for Stormworks. I'm proud.`
                        }
                        break;
                    case "type11":
                        box[0].innerHTML = questions[box[1]]=="Yes" ? "You've been muted? Damn. I hope it was on accident." : "Good Job! Here, have a sticker. Crap, I dropped it.";
                        break;
                    case "type12":
                        box[0].innerHTML = questions[box[1]]

                        box2 = document.getElementById("result"+i+"type12");
                        box2.innerHTML = randoms[box[1]][getRandomInt(4)];
                        break;
                    case "type13":
                        box[0].innerHTML = questions[box[1]]=="Yes" ? "indeed" : "not";

                        box2 = document.getElementById("result"+i+"type13");
                        box2.innerHTML = randoms[box[1]][getRandomInt(4)];
                        break;
                    case "type14":
                        let userGift = questions[box[1]].replace(/_/g, " ");
                        box[0].innerHTML = userGift;

                        box2 = document.getElementById("result"+i+"type14");
                        box2.innerHTML = randoms[box[1]][getRandomInt(4)];
                        break;
                    case "type15":
                        let reason = "bad at the game. Sorry to tell you like this. We both knew it was coming.";
                        if (parseInt(userData["score"].substring(0, 2)) <= 11) {
                            reason = "not good at test taking. Your score on the quiz wasn't high enough. Trust me, it wasn't rigged.";
                        }
                        if (questions[5] == "Yes") {
                            reason = "in SPL. Bad move.";
                        }
                        box[0].innerHTML = reason;
                        break;
                    default:
                        break;
                }
            }

            document.getElementById("results").style.display = "block";
        }
    }

    function getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }
});

async function downloadPdf() {
    console.log("Downloading user PDF");

    try {
        const queryString = new URLSearchParams({name:selectedName}).toString();
        const response = await fetch(`${server}/api/getDataDownload?${queryString}`);

        if(response.status != 200) {
            showError(`${response.status} - ${response.statusText}`);
        } else {
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.download = `${selectedName}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }
    } catch (error) {
        console.error("Failed to download PDF:", error);
        showError("Failed to download PDF. Please try again.");
    }
}

async function downloadCert() {
    console.log("Downloading user cert");

    try {
        const queryString = new URLSearchParams({name:selectedName}).toString();
        const response = await fetch(`${server}/api/getCertDownload?${queryString}`);

        if(response.status != 200) {
            showError(`${response.status} - ${response.statusText}`);
        } else {
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.download = `${selectedName}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }
    } catch (error) {
        console.error("Failed to download cert:", error);
        showError("Failed to download certificate. Please try again.");
    }
}

async function downloadGift() {
    console.log("Downloading user gift");

    try {
        const queryString = new URLSearchParams({name:selectedName}).toString();
        const response = await fetch(`${server}/api/getGiftDownload?${queryString}`);

        if(response.status != 200) {
            showError(`${response.status} - ${response.statusText}`);
        } else {
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);

            xmlName = document.getElementById("result14").innerHTML;

            const link = document.createElement("a");
            link.href = url;
            link.download = `${xmlName}.xml`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }
    } catch (error) {
        console.error("Failed to download gift:", error);
        showError("Failed to download present. Please try again.");
    }
}

function showError(msg) {
    console.log(msg);
    const errbox = document.getElementById("errbox");
    const errmsg = document.getElementById("errmsg");
    errbox.style.display = "block";
    errmsg.innerHTML = msg;

    setTimeout(function() {
        errbox.style.display = "none";
        errmsg.innerHTML = "";
    }, 5000)
}