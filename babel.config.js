module.exports = api => {
    const isTest = api.env('test');
    
    // Presets comunes para todos los entornos, incluyendo el de prueba
    const presets = [
      ['@babel/preset-env', { targets: { node: 'current' } }],
      '@babel/preset-typescript',
    ];
  
    if (isTest) {
    
    }
  
    return {
      presets,
    };
  };
  