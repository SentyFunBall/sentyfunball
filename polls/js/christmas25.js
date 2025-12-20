let server = "https://christmas-25.uc.r.appspot.com"
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

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

async function setPoem() {
    const poemDiv = document.getElementById("poem");
    const response = await fetch("./js/random.json");
    const randoms = await response.json();

    poemDiv.innerHTML = `<p><em>${randoms["1"][getRandomInt(4)]}</em></p>`;
}

//on load
document.addEventListener("DOMContentLoaded", async() => {
    console.log("Creating event listeners");
    const searchBox = document.getElementById("searchbox");
    const nameList = document.getElementById("namelist");
    const submitBtn = document.getElementById("submitbutton");

    await setPoem();

    let names = await nameFetch();
    if(names == "Not found") {
        console.log("Couldn't fetch names");
        showError("Failed to connect to server.");
    }
    let alreadySubmit = false;
    let userData = {};

    let resultBoxes = [];
    for (let i = 0; i < 25; i++) {
        let box = document.getElementById("result" + i);
        if (!box) continue;
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
            selectedName = selectedName.length > 128 ? selectedName.substring(0, 128) : selectedName;
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
            const response = await fetch("./js/random.json");
            const randoms = await response.json();
            const questions = userData.questions
            
            for (let i = 0; i < resultBoxes.length; i++) {
                let box = resultBoxes[i];
                let box2
                
                //difference response additions
                switch (box[0].classList[0]) {
                    case "type0":
                        box[0].innerHTML = questions[box[1]]=="Nice" ? "as a very Nice Stormworker" : "Naughty, what a terrible fate";
                        
                        box2 = document.getElementById("result"+i+"type0");
                        box2.innerHTML = randoms[box[1]][getRandomInt(4)] + ` You were ${questions[box[1]]}. Welcome to the club. <b>61% were nice</b>.`;
                        break;
                    case "type1":
                        box[0].innerHTML =
                        questions[box[1]] === "I was a good Stormworker this year"
                            ? "a good Stormworker this year."
                            : questions[box[1]] === "I am Deltars (the goodest Stormworker)"
                            ? "as good as Deltars himself (who only has 2k hours mind you)"
                                                            : "a bad Stormworker this year.";
                        
                        box2 = document.getElementById("result"+i+"type1");
                        box2.innerHTML = randoms[box[1]][getRandomInt(4)] + " <b>76%</b> of Stormworkers said they were good this year. Those who struck the hospital ship are the only ones who can say that.";
                        break;
                    case "type2":
                        box[0].innerHTML = questions[box[1]]=="No" ? "have never stolen a vehicle. Good lad." : questions[box[1]]=="Yes" ? "have stolen a vehicle. Bad lad." : "are literally yambag. Worst of the worst.";
                        break;
                    case "type3":
                        box[0].innerHTML = questions[box[1]];

                        box2 = document.getElementById("result"+i+"type3");
                        box2.innerHTML = "<b>81%</b> of <s>Aridistanis</s> Stormworkers got this correct, answering either modulars, jets, electric, or steam, and YOU might be one of them! " + randoms[box[1]][getRandomInt(4)];
                        break;
                    case "type4":
                        box[0].innerHTML= questions[box[1]]
                        break;
                    case "type5":
                        box[0].innerHTML = questions[box[1]]=="Yes" ? " XML edit. I'm proud." : "not XML edit. Gotta ask, do you still think it's cheating?";

                        box2 = document.getElementById("result"+i+"type5");
                        box2.innerHTML = "Turns out you're not alone. <b>82%</b> of Stormworkers admitted to XML editing. " + randoms[box[1]][getRandomInt(4)];
                        break;
                    case "type6":
                        box[0].innerHTML = questions[box[1]];
                        break;
                    case "type7":
                        box[0].innerHTML= questions[box[1]];

                        box2 = document.getElementById("result"+i+"type7");
                        box2.innerHTML =  randoms[box[1]][getRandomInt(4)];
                        break;
                    case "type8":
                        box[0].innerHTML= questions[box[1]] == "Yes" ? "are in fact excited for the new game" : questions[box[1]] == "No" ? "are not excited for the new game" : "just want to get away from Stormworks altogether";

                        box2 = document.getElementById("result"+i+"type8");
                        box2.innerHTML =  randoms[box[1]][getRandomInt(4)];
                        break;
                    case "type9":
                        let ans = questions[box[1]];
                        box[0].innerHTML = ans
                        let isCorrect = false;
                        if (ans == "1001-2000" || ans == "2001-4000" || ans == "4001-6000" || ans == "6001-10000") {
                            isCorrect = true;
                        }

                        box2 = document.getElementById("result"+i+"type9");
                        box2.innerHTML = isCorrect ? `Correct! <b>77%</b> of Stormworkers are in the same range as you. ` + randoms[box[1]][getRandomInt(4)] : `Incorrect. <b>77%</b> of Stormworkers are in the 1001-10000 hours range. ` + randoms[box[1]][getRandomInt(4)];
                        break;
                    case "type10":
                        box[0].innerHTML = questions[box[1]];

                        box2 = document.getElementById("result"+i+"type10");
                        if (questions[box[1]]=="Lua") {
                            box2.innerHTML = `And that's correct! And obviously, you knew that. Cause you're a good Stormworker. <b>48%</b> of Stormworkers use Lua for this task.`;
                        } else {
                            box2.innerHTML = `Terribly sorry, but that's incorrect. The correct answer is Lua. <b>48%</b> of Stormworkers use Lua for this task. If you're asking why, it's because Lua is simply better. Sorry, Liberal.`;
                        }
                        break;
                    case "type11":
                        box[0].innerHTML = questions[box[1]]

                        box2 = document.getElementById("result" + i + "type11");
                        box2.innerHTML = questions[box[1]] == "Yes" ? "Whoops, wrong answer. I hope it was a misclick. <b>83% stay on Windows.</b>" : questions[box[1]] == "I play macOS" ? "Sucker. Enjoy your subpar gaming experience. <b>83% stay on Windows.</b>" : "Fellow Windows gamer! While Windows has a majority for now, I suspect this will shrink in the future for Gaming. <b>83% stay on Windows.</b>";
                        break;
                    case "type12":
                        box[0].innerHTML = questions[box[1]]

                        box2 = document.getElementById("result"+i+"type12");
                        box2.innerHTML = randoms[box[1]][getRandomInt(4)];
                        break;
                    case "type13":
                        box[0].innerHTML = userData["score"].substring(0, 2) + " out of 17";
                        break;
                    case "type14":
                        let userGift = questions[box[1]].replace(/_/g, " ");
                        box[0].innerHTML = userGift;

                        box2 = document.getElementById("result"+i+"type14");
                        box2.innerHTML = randoms[box[1]][getRandomInt(4)];
                        break;
                    case "type15":
                        let reason = randoms["2"][getRandomInt(4)];
                        if (parseInt(userData["score"].substring(0, 2)) <= 11) {
                            reason = "not good at test taking. Your score on the quiz wasn't high enough. Trust me, it wasn't rigged.";
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

            let xmlName = document.getElementById("result22").innerHTML;

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