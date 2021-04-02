import showdown from "showdown";

const converter = new showdown.Converter();

converter.setOption('tables', true);
converter.setOption('emojis', true);
converter.setOption('strikethrough', true);
converter.setOption('simpleLineBreaks', true);
converter.setOption('openLinksInNewWindow', true);
converter.setOption('simplifiedAutoLink', true);

export default converter;