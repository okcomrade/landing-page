module.exports = function(grunt) {
	grunt.initConfig({
		aws: grunt.file.readJSON('aws-keys.json'),
		copy: {
			main: {
				files: [
					{expand: true, cwd: 'src/', src: ['**/*'], dest: 'dist/'}
				],
			},
		},
		aws_s3: {
			options: {
				accessKeyId: '<%= aws.AWSAccessKeyId %>',
				secretAccessKey: '<%= aws.AWSSecretKey %>',
				region: 'us-east-1',
				uploadConcurrency: 5,
				downloadConcurrency: 5,
			},
			staging: {
				options: {
					bucket: 'staging.okcomrade.club',
					differential: true,
				},
				files: [
					{dest: '/', action: 'delete'},
					{expand: true, cwd: 'dist/', src: ['**/*'], dest: '/', action: 'upload'},
				],
			},
			production: {
				options: {
					bucket: 'okcomrade.club',
				},
				files: [
					{expand: true, cwd: 'dist/', src: ['**/*'], dest: '/', action: 'upload'},
				],
			},
			clean_production: {
				options: {
					bucket: 'okcomrade.club',
				},
				files: [
					{dest: '/', action: 'delete'},
				],
			},
		},
	});

	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-aws-s3');

	grunt.registerTask('build', ['copy']);
	grunt.registerTask('default', ['build', 'aws_s3:clean_production', 'aws_s3:production']);
};