function flatten(arr) {
    return arr.reduce(function (flat, toFlatten) {
        return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
    }, []);
}

function unique(arr) {
    let u = {}, a = [];
    let i = 0, l = arr.length;
    for (; i < l; ++i) {
        if (!u.hasOwnProperty(arr[i])) {
            a.push(arr[i]);
            u[arr[i]] = 1;
        }
    }
    return a;
}

function extractRules(providersJson) {
    let parsedJson = JSON.parse(providersJson);
    let frontends = Object.keys(parsedJson).map(frontendName => parsedJson[frontendName].frontends)[0];
    let routes = flatten(Object.keys(frontends)
        .map(frontendKey => frontends[frontendKey])
        .map(frontend => frontend.routes));

    return flatten(routes.map(route =>
        Object.keys(route).map(routeKey => route[routeKey]).map(route => route.rule)));
}

function extractRulesFromTraefik2(routersJson) {
    let parsedJson = JSON.parse(routersJson);
    return parsedJson.map(route => route.rule);
}

function extractHostsFromRules(rules) {

    return flatten(
        flatten(rules.filter(rule => rule)
            .filter(rule => rule.startsWith('Host'))
            .map(rule => rule.match(/^Host:([A-Za-z0-9\-.,]+)$|^Host\(`([A-Za-z0-9\-.,]+)`\)/))
            .map(hostmatches => {
                if (hostmatches) return hostmatches.slice(1);
            }))
            .filter(rule => rule)
            .map(hostRuleString => hostRuleString.split(',')));
}

function extractPathsFromRules(rules) {

    return flatten(
        flatten(rules.filter(rule => rule)
            .filter(rule => rule.startsWith('Path'))
            .map(rule => rule.match(/^Path:([A-Za-z0-9\-./,]+)$|^Path\(`([A-Za-z0-9\-./,]+)`\)/))
            .map(prefixmatches => {
                if (prefixmatches) return prefixmatches.slice(1);
            }))
            .filter(rule => rule)
            .map(prefixRuleString => prefixRuleString.split(',')));
}

function extractPathPrefixesFromRules(rules) {

    return flatten(
        flatten(rules.filter(rule => rule)
            .filter(rule => rule.startsWith('PathPrefix'))
            .map(rule => rule.match(/^PathPrefix:([A-Za-z0-9\-./,]+)$|^PathPrefix\(`([A-Za-z0-9\-./,]+)`\)/))
            .map(prefixmatches => {
                if (prefixmatches) return prefixmatches.slice(1);
            }))
            .filter(rule => rule)
            .map(prefixRuleString => prefixRuleString.split(',')));
}

function extractPathsAndPathPrefixesFromRules(rules) {

    return flatten(
        flatten(rules.filter(rule => rule)
            .filter(rule => rule.startsWith('Path'))
            .map(rule => rule.match(/^Path:([A-Za-z0-9\-./,]+)$|^Path\(`([A-Za-z0-9\-./,]+)`\)|^PathPrefix:([A-Za-z0-9\-./,]+)$|^PathPrefix\(`([A-Za-z0-9\-./,]+)`\)/))
            .map(prefixmatches => {
                if (prefixmatches) return prefixmatches.slice(1);
            }))
            .filter(rule => rule)
            .map(prefixRuleString => prefixRuleString.split(',')));
}

function applyBlacklist(hostNames, blacklistString) {
    let blacklist = blacklistString === '' ? [] : blacklistString.split(',');
    let blacklistRegExps = blacklist.map(regExString => new RegExp(regExString));

    return unique(hostNames
        .filter(hostName => !blacklistRegExps.find(blackListItem => blackListItem.test(hostName))))
}

exports.extractHostsAndApplyBlacklist = (providersJson, blacklistString) => {
    let rules = extractRules(providersJson);

    let hostNames = extractHostsFromRules(rules);
    return applyBlacklist(hostNames, blacklistString).map(value => "http://" + value);
};

exports.extractPathsAndApplyBlacklistFromTraefik2 = (routersJson, blacklistString) => {
    let rules = extractRulesFromTraefik2(routersJson);
    let pathPrefixes = extractPathsFromRules(rules);
    return applyBlacklist(pathPrefixes, blacklistString).map(value => value);
};

exports.extractPathPrefixesAndApplyBlacklistFromTraefik2 = (routersJson, blacklistString) => {
    let rules = extractRulesFromTraefik2(routersJson);
    let pathPrefixes = extractPathPrefixesFromRules(rules);
    return applyBlacklist(pathPrefixes, blacklistString).map(value => value);
};

exports.extractPathsAndPathPrefixesAndApplyBlacklistFromTraefik2 = (routersJson, blacklistString) => {
    let rules = extractRulesFromTraefik2(routersJson);
    let pathsAndPathPrefixes = extractPathsAndPathPrefixesFromRules(rules);
    return applyBlacklist(pathsAndPathPrefixes, blacklistString).map(value => value);
};

exports.extractHostsAndApplyBlacklistFromTraefik2 = (routersJson, blacklistString) => {
    let rules = extractRulesFromTraefik2(routersJson);

    let hostNames = extractHostsFromRules(rules);
    return applyBlacklist(hostNames, blacklistString).map(value => "http://" + value);
};
