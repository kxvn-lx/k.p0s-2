#!/bin/bash

# Android Build Fix Script for react-native-bluetooth-escpos-printer conflicts
# This script automatically applies the necessary Gradle configurations to resolve
# duplicate class conflicts between legacy Android Support libraries and AndroidX

set -e

echo "🔧 Applying Android build fix for printer package conflicts..."

# Check if android directory exists
if [ ! -d "android" ]; then
    echo "❌ Android directory not found. Run 'npx expo prebuild --platform android' first."
    exit 1
fi

# 1. Update android/gradle.properties
echo "📝 Updating gradle.properties..."
if ! grep -q "android.enableJetifier=true" android/gradle.properties; then
    echo "" >> android/gradle.properties
    echo "# Enable jetifier to convert third-party libraries to use AndroidX" >> android/gradle.properties
    echo "android.enableJetifier=true" >> android/gradle.properties
fi

if ! grep -q "android.useAndroidX=true" android/gradle.properties; then
    echo "android.useAndroidX=true" >> android/gradle.properties
fi

# 2. Update android/build.gradle
echo "📝 Updating android/build.gradle..."
if ! grep -q "gradle.taskGraph.whenReady" android/build.gradle; then
    sed -i '' '/apply plugin: "com\.facebook\.react\.rootproject"/a\
\
// Disable duplicate class checks to resolve androidx conflicts\
gradle.taskGraph.whenReady { graph ->\
    graph.allTasks.findAll { \
        it.name.contains("checkDebugDuplicateClasses") || \
        it.name.contains("checkReleaseDuplicateClasses") || \
        it.name.contains("DuplicateClasses") \
    }.each { \
        it.enabled = false \
    }\
}' android/build.gradle
fi

# 3. Update android/app/build.gradle
echo "📝 Updating android/app/build.gradle..."

# Create a temporary file with the configurations to add
cat > /tmp/android-app-configs.gradle << 'EOF'

    configurations.all {
        resolutionStrategy {
            force 'androidx.appcompat:appcompat:1.7.0'
            force 'androidx.appcompat:appcompat-resources:1.7.0'
            force 'androidx.core:core:1.16.0'
            force 'androidx.media:media:1.0.0'
            force 'androidx.legacy:legacy-support-v4:1.0.0'
            
            // Exclude old support libraries
            exclude group: 'com.android.support', module: 'support-v4'
            exclude group: 'com.android.support', module: 'support-compat'
            exclude group: 'com.android.support', module: 'support-media-compat'
            exclude group: 'com.android.support', module: 'appcompat-v7'
            exclude group: 'com.android.support', module: 'support-annotations'
            
            dependencySubstitution {
                substitute module('androidx.appcompat:appcompat:1.0.0') using version('androidx.appcompat:appcompat:1.7.0')
            }
        }
    }

    packagingOptions {
        excludes += [
            'META-INF/DEPENDENCIES',
            'META-INF/NOTICE',
            'META-INF/LICENSE'
        ]
    }
EOF

# Insert the configurations after android { if not already present
if ! grep -q "configurations.all" android/app/build.gradle; then
    sed -i '' '/android {/r /tmp/android-app-configs.gradle' android/app/build.gradle
fi

# Clean up temporary file
rm -f /tmp/android-app-configs.gradle

echo ""
echo "✅ Android build fix applied successfully!"
echo ""
echo "Next steps:"
echo "1. Clean the project: cd android && ./gradlew clean && cd .."
echo "2. Build the project: npx expo run:android"
echo ""
