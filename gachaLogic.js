export function pullOne() {
    /* nothing(trash) -  15
    random amount of raccoons - 50
    lowest - 20
    middle - 10
    highest - 5*/
    let number = Math.random();
    if (number<0.05) { //trash
        return "trash";
    } else if (number<0.25) { //raccoons
        return parseInt(Math.random()*29 + 1);
    } else if (number<0.75) { //lowest: cashier
        return "employee1";
    } else if (number<0.90) { //middle: manager
        return "employee2";
    } else { //highest: boss
        return "employee3";
    }
}

export function pullFive() {
    let final = "";
    for (let i = 0; i < 5; i++) {
        final+=pullOne() + ".";
    }
    return final;
}