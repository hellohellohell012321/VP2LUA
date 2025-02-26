function removeLineBreaks() {
    const input = document.getElementById("input").value.trim();
    if (!input) return; // Prevent errors on empty input
    const output = input.replace(/(\r\n|\n|\r)/g, ""); // Remove all line breaks
    return output;
}

function convertToLua() {
    const input = removeLineBreaks();
    const bpm = document.getElementById("bpmInput").value || 120; // Get BPM value
    if (!input) return; // Prevent errors on empty input

    let luaScript = `bpm = ${bpm}\n\n`;  // Add the BPM line to the output
    let section = 1;
    const lines = input.split("\n");

    lines.forEach(line => {
        line = line.trim();
        if (line === "") return; // Skip empty lines

        luaScript += `\n-- ${section}\n\n`;
        section++;

        let i = 0;
        while (i < line.length) {
            let keypressDuration = 1; // Default duration
            let note = "";

            if (line[i] === "[") {
                // Handle square bracketed groups as a single keypress
                i++; // Move past '['
                while (i < line.length && line[i] !== "]") {
                    note += line[i];
                    i++;
                }
                i++; // Move past ']'
            } else {
                // Single character note
                note = line[i];
                i++;
            }

            // Determine the rest duration based on next character
            let restDuration = 1;
            if (i < line.length) {
                if (line[i] === "-") {
                    restDuration = 1;
                    i++;
                } else if (line[i] === " ") {
                    restDuration = 0.5;
                    i++;
                } else {
                    restDuration = 0.25;
                }
            }

            luaScript += `keypress("${note}", ${restDuration}, ${bpm})\n`;
            luaScript += `rest(${restDuration}, ${bpm})\n`;
        }
    });

    document.getElementById("output").innerText = luaScript;
}

function copyOutput() {
    const output = document.getElementById("output");
    const range = document.createRange();
    range.selectNode(output);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand("copy");
}
