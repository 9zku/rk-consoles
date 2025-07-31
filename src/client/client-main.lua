local config = lib.loadJson('config')

RegisterCommand(config.command, function()
    SetNuiFocus(true, true)
    SendNUIMessage({
        action = "setVisible",
        data = {
            show = true
        }
    })
end, false)

RegisterNUICallback('getConfig', function(data, cb)
    cb(config)
end)

RegisterNUICallback('closeUI', function(data, cb)
    SetNuiFocus(false, false)
    cb({})
end)
