fx_version 'cerulean'
game 'gta5'

author 'rk / 9zku'
description 'rk-consoles'
version '1.0.0'

ui_page 'web/build/index.html'

files {
    'web/build/**',
    'web/build/**/**',
    'config.json'
}

shared_scripts {
    '@ox_lib/init.lua',
}

client_scripts {
    'src/client/*.lua'
}

server_scripts {
    'src/server/*.lua'
}

dependencies {
    'ox_lib',
}

lua54 'yes'

